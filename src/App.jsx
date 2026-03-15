import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

// ─── Palette & constants ────────────────────────────────────────────────────
const C = {
  bg:        '#0d1117',
  surface:   '#161b22',
  border:    '#21262d',
  accent:    '#c9a84c',
  accentDim: '#8a6e2e',
  green:     '#3fb950',
  red:       '#f85149',
  blue:      '#58a6ff',
  muted:     '#8b949e',
  text:      '#e6edf3',
}

// ─── Seed data ───────────────────────────────────────────────────────────────
const CASES = [
  { id: 'LIT-2024-001', client: 'Meridian Corp.',   type: 'Commercial',  status: 'Active',   value: 4_200_000, partner: 'A. Harlow',  filed: '2024-01-15' },
  { id: 'LIT-2024-008', client: 'Vesper Holdings',  type: 'Securities',  status: 'Active',   value: 9_800_000, partner: 'S. Okafor',  filed: '2024-03-02' },
  { id: 'LIT-2024-012', client: 'Elara Pharma',     type: 'IP',          status: 'Won',      value: 2_100_000, partner: 'A. Harlow',  filed: '2024-02-20' },
  { id: 'LIT-2023-044', client: 'Crestwood LLC',    type: 'Employment',  status: 'Settled',  value: 850_000,   partner: 'M. Vance',   filed: '2023-11-08' },
  { id: 'LIT-2023-039', client: 'Orion Logistics',  type: 'Commercial',  status: 'Lost',     value: 1_500_000, partner: 'S. Okafor',  filed: '2023-09-14' },
  { id: 'LIT-2024-019', client: 'Nova Energy Inc.', type: 'Regulatory',  status: 'Active',   value: 6_300_000, partner: 'M. Vance',   filed: '2024-05-01' },
  { id: 'LIT-2024-023', client: 'Halcyon Media',    type: 'IP',          status: 'Active',   value: 3_400_000, partner: 'A. Harlow',  filed: '2024-06-18' },
  { id: 'LIT-2023-028', client: 'Apex Retail Group',type: 'Employment',  status: 'Won',      value: 620_000,   partner: 'M. Vance',   filed: '2023-07-22' },
]

const MONTHLY_REVENUE = [
  { month: 'Jan', billed: 320, collected: 290 },
  { month: 'Feb', billed: 410, collected: 370 },
  { month: 'Mar', billed: 380, collected: 340 },
  { month: 'Apr', billed: 520, collected: 480 },
  { month: 'May', billed: 610, collected: 560 },
  { month: 'Jun', billed: 490, collected: 430 },
  { month: 'Jul', billed: 570, collected: 510 },
  { month: 'Aug', billed: 640, collected: 590 },
]

const OUTCOMES = [
  { label: 'Won',     value: 38, color: C.green  },
  { label: 'Settled', value: 29, color: C.accent },
  { label: 'Active',  value: 24, color: C.blue   },
  { label: 'Lost',    value: 9,  color: C.red    },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt$ = v =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : `$${(v / 1_000).toFixed(0)}K`

const statusColor = s =>
  ({ Active: C.blue, Won: C.green, Settled: C.accent, Lost: C.red }[s] ?? C.muted)

// ─── Revenue bar chart ────────────────────────────────────────────────────────
function RevenueChart() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { width } = el.getBoundingClientRect()
    const h = 180, ml = 40, mr = 10, mt = 10, mb = 30
    const W = width - ml - mr
    const H = h - mt - mb

    d3.select(el).selectAll('*').remove()

    const svg = d3.select(el)
      .append('svg').attr('width', width).attr('height', h)
      .append('g').attr('transform', `translate(${ml},${mt})`)

    const x0 = d3.scaleBand().domain(MONTHLY_REVENUE.map(d => d.month)).range([0, W]).padding(0.3)
    const x1 = d3.scaleBand().domain(['billed', 'collected']).range([0, x0.bandwidth()]).padding(0.05)
    const y  = d3.scaleLinear().domain([0, 700]).range([H, 0])

    svg.append('g').attr('transform', `translate(0,${H})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .select('.domain').remove()
    svg.selectAll('.tick text').attr('fill', C.muted).attr('font-size', 11)

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}K`).tickSize(-W))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').attr('stroke', C.border))
      .call(g => g.selectAll('text').attr('fill', C.muted).attr('font-size', 10))

    const groups = svg.selectAll('.bar-group')
      .data(MONTHLY_REVENUE).enter().append('g')
      .attr('transform', d => `translate(${x0(d.month)},0)`)

    const barData = [
      { key: 'billed',    color: C.accentDim },
      { key: 'collected', color: C.accent    },
    ]
    barData.forEach(({ key, color }) => {
      groups.append('rect')
        .attr('x', x1(key))
        .attr('y', d => y(d[key]))
        .attr('width', x1.bandwidth())
        .attr('height', d => H - y(d[key]))
        .attr('fill', color)
        .attr('rx', 2)
    })
  }, [])

  return <div ref={ref} style={{ width: '100%' }} />
}

// ─── Donut chart ─────────────────────────────────────────────────────────────
function DonutChart() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const size = 160, r = 70, ir = 48

    d3.select(el).selectAll('*').remove()

    const svg = d3.select(el)
      .append('svg').attr('width', size).attr('height', size)
      .append('g').attr('transform', `translate(${size / 2},${size / 2})`)

    const arc  = d3.arc().innerRadius(ir).outerRadius(r)
    const pie  = d3.pie().value(d => d.value).sort(null)
    const arcs = pie(OUTCOMES)

    svg.selectAll('path')
      .data(arcs).enter().append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', C.bg)
      .attr('stroke-width', 2)

    // centre label
    svg.append('text').attr('text-anchor', 'middle').attr('dy', '-0.2em')
      .attr('fill', C.text).attr('font-size', 22).attr('font-weight', 700)
      .text('100')
    svg.append('text').attr('text-anchor', 'middle').attr('dy', '1.2em')
      .attr('fill', C.muted).attr('font-size', 11)
      .text('cases')
  }, [])

  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }} />
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: '16px 20px',
    }}>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ color: color ?? C.text, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const active   = CASES.filter(c => c.status === 'Active')
  const totalExp = CASES.reduce((s, c) => s + c.value, 0)
  const winRate  = Math.round((CASES.filter(c => c.status === 'Won').length /
    CASES.filter(c => ['Won', 'Lost', 'Settled'].includes(c.status)).length) * 100)

  const filtered = CASES.filter(c =>
    (filter === 'All' || c.status === filter) &&
    (c.client.toLowerCase().includes(search.toLowerCase()) ||
     c.id.toLowerCase().includes(search.toLowerCase()))
  )

  const statuses = ['All', 'Active', 'Won', 'Settled', 'Lost']

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      color: C.text,
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: 14,
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: C.surface,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#000',
          }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>NBNN Law</span>
          <span style={{ color: C.border, margin: '0 4px' }}>|</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Litigation Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: C.green, boxShadow: `0 0 6px ${C.green}`,
          }} />
          <span style={{ color: C.muted, fontSize: 12 }}>Live · Q3 2024</span>
        </div>
      </header>

      <main style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* KPI Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}>
          <StatCard label="Active Cases"       value={active.length}   sub={`${active.filter(c => c.type === 'Commercial').length} commercial`} color={C.blue}   />
          <StatCard label="Total Exposure"     value={fmt$(totalExp)}  sub="across all matters"                                                 color={C.accent} />
          <StatCard label="Win Rate"           value={`${winRate}%`}   sub="closed matters (YTD)"                                               color={C.green}  />
          <StatCard label="Avg. Case Value"    value={fmt$(totalExp / CASES.length)} sub="per matter"                                           />
        </div>

        {/* Middle row: Revenue chart + Donut */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 16,
          marginBottom: 28,
        }}>
          {/* Revenue */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '20px 20px 12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Revenue · 2024 YTD</span>
              <div style={{ display: 'flex', gap: 16 }}>
                {[{ label: 'Billed', color: C.accentDim }, { label: 'Collected', color: C.accent }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                    <span style={{ color: C.muted, fontSize: 12 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <RevenueChart />
          </div>

          {/* Outcomes donut */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '20px',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Case Outcomes</div>
            <DonutChart />
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {OUTCOMES.map(o => (
                <div key={o.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: o.color }} />
                    <span style={{ color: C.muted, fontSize: 13 }}>{o.label}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{o.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cases table */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {/* Table header bar */}
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <span style={{ fontWeight: 600 }}>Matters</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Search */}
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search client or ID…"
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  color: C.text,
                  fontSize: 13,
                  outline: 'none',
                  width: 200,
                }}
              />
              {/* Filter pills */}
              <div style={{ display: 'flex', gap: 4 }}>
                {statuses.map(s => (
                  <button key={s} onClick={() => setFilter(s)} style={{
                    background: filter === s ? C.accent : 'transparent',
                    border: `1px solid ${filter === s ? C.accent : C.border}`,
                    borderRadius: 20,
                    padding: '4px 12px',
                    color: filter === s ? '#000' : C.muted,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontWeight: filter === s ? 600 : 400,
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Matter ID', 'Client', 'Type', 'Partner', 'Value', 'Filed', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    color: C.muted,
                    fontWeight: 500,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `1px solid ${C.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                  transition: 'background 0.15s',
                }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: C.blue }}>{c.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.client}</td>
                  <td style={{ padding: '12px 16px', color: C.muted }}>{c.type}</td>
                  <td style={{ padding: '12px 16px', color: C.muted }}>{c.partner}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{fmt$(c.value)}</td>
                  <td style={{ padding: '12px 16px', color: C.muted, fontSize: 13 }}>{c.filed}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: statusColor(c.status) + '22',
                      color: statusColor(c.status),
                      border: `1px solid ${statusColor(c.status)}44`,
                      borderRadius: 20,
                      padding: '3px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                    }}>{c.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: C.muted }}>
                    No matters match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
