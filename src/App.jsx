import { useMemo, useState } from "react";

const SECTIONS = [
  { key: "overview", label: "Overview", icon: "◈" },
  { key: "map", label: "Circuit Map", icon: "◉" },
  { key: "phases", label: "Phases", icon: "▦" },
  { key: "engine", label: "AI Engine", icon: "⬡" },
  { key: "finance", label: "Financials", icon: "◇" },
  { key: "marketing", label: "Marketing", icon: "◎" },
  { key: "compliance", label: "Compliance", icon: "◫" },
  { key: "kpi", label: "KPIs", icon: "◨" },
];

const CIRCUITS = [
  { id: "1st", color: "#E8927C", states: ["ME", "MA", "NH", "RI", "PR"] },
  { id: "2nd", color: "#F2C078", states: ["CT", "NY", "VT"] },
  { id: "3rd", color: "#A8D5BA", states: ["DE", "NJ", "PA", "VI"] },
  { id: "4th", color: "#7EC8E3", states: ["MD", "NC", "SC", "VA", "WV"] },
  { id: "5th", color: "#C3A6D8", states: ["LA", "MS", "TX"] },
  { id: "6th", color: "#F7A4A4", states: ["KY", "MI", "OH", "TN"] },
  { id: "7th", color: "#B5D99C", states: ["IL", "IN", "WI"] },
  { id: "8th", color: "#FFD6A5", states: ["AR", "IA", "MN", "MO", "NE", "ND", "SD"] },
  { id: "9th", color: "#FFB3B3", states: ["AK", "AZ", "CA", "HI", "ID", "MT", "NV", "OR", "WA", "GU", "MP"] },
  { id: "10th", color: "#A5C9F1", states: ["CO", "KS", "NM", "OK", "UT", "WY"] },
  { id: "11th", color: "#D4A5E8", states: ["AL", "FL", "GA"] },
  { id: "D.C.", color: "#E8D4A5", states: ["DC"] },
];

const PHASE_DATA = [
  {
    phase: "Phase Zero",
    subtitle: "Foundation",
    timeline: "4-8 weeks",
    color: "#E8927C",
    objectives: [
      "Convert vision into a bounded practice thesis",
      "Build case underwriting model and repeatable production pipeline",
      "Implement compliance control plane: AI policy, trust readiness, security baseline",
    ],
  },
  {
    phase: "Phase One",
    subtitle: "Solo Operator",
    timeline: "6-12 months",
    color: "#7EC8E3",
    objectives: [
      "Validate case selection rubric predicts outcomes",
      "Build production cadence: intake -> filing -> discovery -> settlement",
      "Maintain trust/security/AI compliance as volume grows",
    ],
  },
  {
    phase: "Phase Two",
    subtitle: "Boutique Build-Out",
    timeline: "12-24 months",
    color: "#A8D5BA",
    objectives: [
      "Specialize into 1-3 claim families with informational advantage",
      "Hire into staffing lanes, not general helpers",
      "Upgrade security and governance for bigger defendants",
    ],
  },
  {
    phase: "Phase Three+",
    subtitle: "National Expansion",
    timeline: "24+ months",
    color: "#C3A6D8",
    objectives: [
      "Deploy circuit-node model across all 13 federal circuits",
      "Scale through federal court uniformity and local counsel networks",
      "Establish a preeminent AI-powered litigation operation",
    ],
  },
];

const styles = {
  page: { background: "#0A0E17", color: "#E2E8F0", minHeight: "100vh", fontFamily: "system-ui, sans-serif" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 24px",
    borderBottom: "1px solid #2A3A4E",
    position: "sticky",
    top: 0,
    background: "rgba(10,14,23,0.92)",
    backdropFilter: "blur(8px)",
  },
  nav: { display: "flex", gap: 6, flexWrap: "wrap" },
  btn: { border: "1px solid #2A3A4E", background: "#111827", color: "#94A3B8", padding: "6px 10px", borderRadius: 8 },
  btnActive: { color: "#D4A574", borderColor: "#D4A574" },
  content: { maxWidth: 1100, margin: "0 auto", padding: 24 },
  card: { background: "#1E293B", border: "1px solid #2A3A4E", borderRadius: 12, padding: 16 },
};

function Overview() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Ngehsi Brendan Ngwa Nforbi, Attorneys at Law — Unified Business Plan</h1>
      <p>
        AI-native, multi-track plaintiff litigation firm concept focused on civil rights, state torts,
        and immigration law with compliance-first operations.
      </p>
      <div style={{ ...styles.card }}>
        <h3>Core constraint</h3>
        <p>
          The limiting factor is safe AI deployment under confidentiality, supervision, trust-accounting,
          and technology competence requirements.
        </p>
      </div>
    </div>
  );
}

function MapSection() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Circuit Coverage</h1>
      <p>Configured federal circuit targets and anchor-state groupings.</p>
      <div style={{ ...styles.card, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Circuit</th>
              <th align="left">States / Territories</th>
            </tr>
          </thead>
          <tbody>
            {CIRCUITS.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: "8px 0", color: c.color }}>{c.id}</td>
                <td>{c.states.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PhaseSection() {
  const [expanded, setExpanded] = useState(0);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>Phased Operating Blueprint</h1>
      {PHASE_DATA.map((p, i) => (
        <button
          key={p.phase}
          type="button"
          onClick={() => setExpanded(expanded === i ? -1 : i)}
          style={{ ...styles.card, textAlign: "left", cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{p.phase}</strong>
            <span style={{ color: p.color }}>{p.timeline}</span>
          </div>
          <div style={{ color: "#94A3B8", marginTop: 6 }}>{p.subtitle}</div>
          {expanded === i && (
            <ul>
              {p.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          )}
        </button>
      ))}
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div style={styles.card}>
      <h1>{title}</h1>
      <p>This section is scaffolded and ready for the full detailed content you supplied.</p>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");

  const section = useMemo(() => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "map":
        return <MapSection />;
      case "phases":
        return <PhaseSection />;
      case "engine":
        return <Placeholder title="AI Engine" />;
      case "finance":
        return <Placeholder title="Financials" />;
      case "marketing":
        return <Placeholder title="Marketing" />;
      case "compliance":
        return <Placeholder title="Compliance" />;
      case "kpi":
        return <Placeholder title="KPIs" />;
      default:
        return null;
    }
  }, [activeSection]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={{ color: "#D4A574", fontWeight: 700 }}>Ngehsi Brendan Ngwa Nforbi, Attorneys at Law</div>
          <div style={{ color: "#94A3B8", fontSize: 12 }}>Guerrilla Litigation · Maximum Accountability</div>
        </div>
        <nav style={styles.nav}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSection(s.key)}
              style={{ ...styles.btn, ...(activeSection === s.key ? styles.btnActive : {}) }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </nav>
      </header>
      <main style={styles.content}>{section}</main>
    </div>
  );
}
