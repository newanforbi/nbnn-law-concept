import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

// ── Circuit data ──────────────────────────────────────────────────
const CIRCUITS = [
  { id: "1st", color: "#E8927C", states: ["ME","MA","NH","RI","PR"] },
  { id: "2nd", color: "#F2C078", states: ["CT","NY","VT"] },
  { id: "3rd", color: "#A8D5BA", states: ["DE","NJ","PA","VI"] },
  { id: "4th", color: "#7EC8E3", states: ["MD","NC","SC","VA","WV"] },
  { id: "5th", color: "#C3A6D8", states: ["LA","MS","TX"] },
  { id: "6th", color: "#F7A4A4", states: ["KY","MI","OH","TN"] },
  { id: "7th", color: "#B5D99C", states: ["IL","IN","WI"] },
  { id: "8th", color: "#FFD6A5", states: ["AR","IA","MN","MO","NE","ND","SD"] },
  { id: "9th", color: "#FFB3B3", states: ["AK","AZ","CA","HI","ID","MT","NV","OR","WA","GU","MP"] },
  { id: "10th", color: "#A5C9F1", states: ["CO","KS","NM","OK","UT","WY"] },
  { id: "11th", color: "#D4A5E8", states: ["AL","FL","GA"] },
  { id: "D.C.", color: "#E8D4A5", states: ["DC"] },
];

const STATE_FIPS = {
  AL:"01",AK:"02",AZ:"04",AR:"05",CA:"06",CO:"08",CT:"09",DE:"10",DC:"11",FL:"12",
  GA:"13",HI:"15",ID:"16",IL:"17",IN:"18",IA:"19",KS:"20",KY:"21",LA:"22",ME:"23",
  MD:"24",MA:"25",MI:"26",MN:"27",MS:"28",MO:"29",MT:"30",NE:"31",NV:"32",NH:"33",
  NJ:"34",NM:"35",NY:"36",NC:"37",ND:"38",OH:"39",OK:"40",OR:"41",PA:"42",RI:"44",
  SC:"45",SD:"46",TN:"47",TX:"48",UT:"49",VT:"50",VA:"51",WA:"53",WV:"54",WI:"55",WY:"56"
};

const fipsToCircuit = {};
CIRCUITS.forEach(c => c.states.forEach(s => { if (STATE_FIPS[s]) fipsToCircuit[STATE_FIPS[s]] = c; }));

const NODES = [
  { city: "Boston, MA", circuit: "1st", lat: 42.36, lng: -71.06, rationale: "High-density immigrant populations; progressive courts favorable to civil rights claims." },
  { city: "New York City / Brooklyn, NY", circuit: "2nd", lat: 40.68, lng: -73.94, rationale: "Massive immigration dockets; high volume of municipal liability and police misconduct claims." },
  { city: "Philadelphia / Newark", circuit: "3rd", lat: 40.00, lng: -75.13, rationale: "Dense urban civil rights claims; Newark holds 90K+ pending EOIR immigration cases." },
  { city: "Alexandria / Baltimore", circuit: "4th", lat: 39.28, lng: -76.62, rationale: "Federal agency proximity; Alexandria 'Rocket Docket'; heavy police misconduct volume." },
  { city: "Houston / El Paso, TX", circuit: "5th", lat: 29.76, lng: -95.37, rationale: "Critical for immigration detention, border enforcement litigation, mass deportation challenges." },
  { city: "Detroit, MI", circuit: "6th", lat: 42.33, lng: -83.05, rationale: "High poverty rates, significant municipal liability, heavily underserved plaintiff bar." },
  { city: "Chicago, IL", circuit: "7th", lat: 41.88, lng: -87.63, rationale: "Core Midwest hub; exceptionally high §1983 and excessive force litigation volume." },
  { city: "St. Louis, MO", circuit: "8th", lat: 38.63, lng: -90.20, rationale: "Protest-related litigation, jail condition claims, police force accountability." },
  { city: "Sacramento / Stockton, CA", circuit: "9th (Base)", lat: 38.58, lng: -121.49, rationale: "EDCA proximity, state agencies, high-density parole/probation populations. HOME BASE." },
  { city: "Denver / Albuquerque", circuit: "10th", lat: 39.74, lng: -104.99, rationale: "Growing immigration hubs; Native American jurisdiction overlaps." },
  { city: "Atlanta / Miami", circuit: "11th", lat: 33.75, lng: -84.39, rationale: "Massive ICE detention footprint; heavy immigration and civil rights dockets." },
  { city: "Washington, D.C.", circuit: "D.C.", lat: 38.91, lng: -77.04, rationale: "Essential for APA/Mandamus against USCIS, DHS, DOJ headquarters." },
];

// ── Section data ──────────────────────────────────────────────────
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

const PHASE_DATA = [
  {
    phase: "Phase Zero", subtitle: "Foundation", timeline: "4–8 weeks",
    color: "#E8927C",
    objectives: [
      "Convert vision into a bounded practice thesis",
      "Build case underwriting model and repeatable production pipeline",
      "Implement compliance control plane: AI policy, trust readiness, security baseline",
    ],
    deliverables: [
      "Matter selection rubric with disqualification gates",
      "Damages model workbook by claim families",
      "Multi-track decision map for California deadlines",
      "AI usage policy and SOP with tool allowlist/denylist",
      "Trust accounting readiness kit (Rule 1.15)",
      "Security baseline mapped to NIST CSF 2.0",
      "Template set (fee agreement, complaints, discovery shells)",
    ],
    budget: { low: "$2K–$8K", mid: "$8K–$25K", high: "$25K–$75K" },
    team: "Founder only + optional fractional bookkeeper",
    trigger: "Complete simulated matter with logged verification and no-unsafe-disclosure workflow",
  },
  {
    phase: "Phase One", subtitle: "Solo Operator", timeline: "6–12 months",
    color: "#7EC8E3",
    objectives: [
      "Validate case selection rubric predicts outcomes",
      "Build production cadence: intake → filing → discovery → settlement",
      "Build compounding assets: pleading libraries, damages models, expert lists",
      "Maintain trust/security/AI compliance as volume grows",
    ],
    deliverables: [
      "100-point underwriting scoring system operational",
      "Disqualification gates with hard-no criteria",
      "Weekly expected-value case reviews",
      "Settlement disbursement SOP with lien register",
      "AI six-control framework enforced",
    ],
    budget: { low: "$1.5K–$4K/mo", mid: "$4K–$10K/mo", high: "$10K–$25K/mo" },
    team: "Founder → intake assistant → contract paralegal → bookkeeper",
    trigger: "Stable throughput, measurable unit economics, zero unverified citations",
  },
  {
    phase: "Phase Two", subtitle: "Boutique Build-Out", timeline: "12–24 months",
    color: "#A8D5BA",
    objectives: [
      "Specialize into 1–3 claim families with informational advantage",
      "Hire into staffing lanes, not general helpers",
      "Make quality measurable: error rates, deadline performance, settlement velocity",
      "Upgrade security and governance for bigger defendants",
    ],
    deliverables: [
      "Full staffing lanes: paralegal, intake, associate, damages, ops",
      "Multi-track playbook mature and repeatable",
      "Audit-ready trust and security governance",
      "Peer review + QA loops functioning without founder",
    ],
    budget: { low: "$15K–$35K/mo", mid: "$35K–$80K/mo", high: "$80K–$160K/mo" },
    team: "Founder + paralegal → intake specialist → associate → damages → ops",
    trigger: "Can add headcount without degrading outcomes; AI controls followed by non-founders",
  },
  {
    phase: "Phase Three+", subtitle: "National Expansion", timeline: "24+ months",
    color: "#C3A6D8",
    objectives: [
      "Deploy circuit-node model across all 13 federal circuits",
      "Scale through federal court uniformity and local counsel networks",
      "Penetrate local state courts via AI + local counsel dual approach",
      "Establish the firm as preeminent AI-powered litigation force",
    ],
    deliverables: [
      "13 circuit anchor nodes operational",
      "Salaried attorney network with performance bonuses",
      "Centralized AI engine serving all nodes",
      "National brand dominance in target practice areas",
    ],
    budget: { low: "Varies", mid: "by circuit", high: "deployment" },
    team: "CEO/Systems Architect + salaried litigators ($100K–$130K base)",
    trigger: "Per-circuit ROI positive within 18 months of node deployment",
  },
];

// ── Styles ────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #0A0E17;
  --bg2: #111827;
  --bg3: #1A2332;
  --surface: #1E293B;
  --border: #2A3A4E;
  --text: #E2E8F0;
  --text2: #94A3B8;
  --accent: #D4A574;
  --accent2: #E8927C;
  --gold: #C9A96E;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────── */
.header {
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(16px);
  background: rgba(10,14,23,0.94);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 68px;
  gap: 24px;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold) 30%, var(--accent2) 60%, transparent);
  opacity: 0.4;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.logo-monogram {
  width: 42px;
  height: 42px;
  border: 1.5px solid var(--gold);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Instrument Serif', serif;
  font-size: 13px;
  color: var(--gold);
  letter-spacing: -0.5px;
  flex-shrink: 0;
  position: relative;
  background: rgba(201,169,110,0.06);
}

.logo-monogram::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(201,169,110,0.18);
  border-radius: 2px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.logo {
  font-family: 'Instrument Serif', serif;
  font-size: 17px;
  color: var(--text);
  letter-spacing: -0.2px;
  line-height: 1;
}

.logo-sub {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2.8px;
  color: var(--accent);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 7px;
  line-height: 1;
}

.logo-sub::before {
  content: '';
  display: block;
  width: 20px;
  height: 1px;
  background: var(--accent);
  flex-shrink: 0;
}

/* ── Nav ──────────────────────────────── */
.nav {
  display: flex;
  gap: 2px;
  background: var(--bg2);
  border-radius: 10px;
  padding: 3px;
}

.nav-btn {
  background: none;
  border: none;
  color: var(--text2);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-btn:hover { color: var(--text); background: var(--bg3); }

.nav-btn.active {
  background: var(--surface);
  color: var(--accent);
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.nav-icon {
  font-size: 14px;
  opacity: 0.7;
}

/* ── Content ──────────────────────────── */
.content {
  flex: 1;
  padding: 40px 48px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: fadeUp 0.4s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  font-family: 'Instrument Serif', serif;
  font-size: 42px;
  color: var(--text);
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.section-subtitle {
  font-size: 15px;
  color: var(--text2);
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 720px;
}

/* ── Cards ──────────────────────────── */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  transition: all 0.3s;
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(212,165,116,0.08);
}

.card-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--accent);
  margin-bottom: 12px;
  font-weight: 600;
}

.card-value {
  font-family: 'Instrument Serif', serif;
  font-size: 32px;
  color: var(--text);
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.6;
}

/* ── Pillar cards ──────────────────── */
.pillar {
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg3) 100%);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.pillar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--accent);
}

.pillar-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 2px;
  margin-bottom: 14px;
}

.pillar-title {
  font-family: 'Instrument Serif', serif;
  font-size: 24px;
  margin-bottom: 14px;
}

.pillar-text {
  font-size: 14px;
  color: var(--text2);
  line-height: 1.7;
}

/* ── Map ──────────────────────────── */
.map-container {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.map-container::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 80%, rgba(212,165,116,0.04), transparent 70%);
}

.map-svg {
  width: 100%;
  height: auto;
  display: block;
}

.map-svg .state {
  stroke: var(--bg);
  stroke-width: 0.6;
  transition: opacity 0.2s;
  cursor: pointer;
}

.map-svg .state:hover { opacity: 0.8; }

.map-svg .node-dot {
  cursor: pointer;
  transition: r 0.2s;
}

.map-svg .node-dot:hover { r: 7; }

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text2);
  letter-spacing: 0.5px;
}

.legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

/* ── Tooltip ──────────────────────── */
.tooltip {
  position: fixed;
  background: var(--bg);
  border: 1px solid var(--accent);
  border-radius: 10px;
  padding: 16px 20px;
  max-width: 320px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  animation: tooltipIn 0.2s ease;
}

@keyframes tooltipIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.tooltip-city {
  font-family: 'Instrument Serif', serif;
  font-size: 18px;
  color: var(--accent);
  margin-bottom: 4px;
}

.tooltip-circuit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.tooltip-text {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.6;
}

/* ── Phase timeline ──────────────── */
.phase-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.phase-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.phase-card {
  display: flex;
  gap: 32px;
  padding: 28px 0;
  position: relative;
  cursor: pointer;
}

.phase-dot {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--bg);
  flex-shrink: 0;
  z-index: 2;
  transition: transform 0.2s;
}

.phase-card:hover .phase-dot { transform: scale(1.15); }

.phase-body {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  transition: all 0.3s;
}

.phase-card:hover .phase-body,
.phase-card.active .phase-body {
  border-color: var(--accent);
  box-shadow: 0 4px 24px rgba(212,165,116,0.08);
}

.phase-header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 6px;
}

.phase-name {
  font-family: 'Instrument Serif', serif;
  font-size: 24px;
}

.phase-sub {
  font-size: 13px;
  color: var(--text2);
}

.phase-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.phase-detail {
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.3s;
}

.phase-detail.collapsed { max-height: 0; opacity: 0; }
.phase-detail.expanded { max-height: 2000px; opacity: 1; }

.detail-section {
  margin-bottom: 18px;
}

.detail-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent);
  margin-bottom: 8px;
  font-weight: 600;
}

.detail-list {
  list-style: none;
  padding: 0;
}

.detail-list li {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.6;
  padding: 3px 0 3px 16px;
  position: relative;
}

.detail-list li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 700;
}

.budget-row {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.budget-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
}

.trigger-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  padding: 14px 18px;
  font-size: 13px;
  color: var(--text2);
  line-height: 1.6;
}

/* ── AI Engine ──────────────────── */
.layer-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.layer {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px 28px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  transition: all 0.3s;
}

.layer:hover {
  border-color: var(--accent);
  transform: translateX(4px);
}

.layer-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--bg3);
  color: var(--accent);
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 1px;
  border: 1px solid var(--border);
}

.layer-content h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 19px;
  margin-bottom: 8px;
}

.layer-content p {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.7;
}

/* ── Control grid ────────────────── */
.control-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.control-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 22px;
  transition: all 0.3s;
}

.control-card:hover {
  border-color: var(--accent2);
}

.control-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  color: var(--accent);
  margin-bottom: 8px;
}

.control-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.control-desc {
  font-size: 12px;
  color: var(--text2);
  line-height: 1.6;
}

/* ── Table ──────────────────────── */
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 28px;
}

.data-table th {
  background: var(--bg3);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent);
  padding: 14px 18px;
  text-align: left;
  font-weight: 600;
}

.data-table td {
  padding: 12px 18px;
  font-size: 13px;
  color: var(--text2);
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.data-table tr:nth-child(even) td { background: var(--bg2); }

.data-table td:first-child { font-weight: 500; color: var(--text); }

/* ── KPI gauges ──────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.kpi-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text2);
  margin-bottom: 14px;
}

.kpi-phases {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.kpi-phase-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
}

@media (max-width: 1024px) {
  .grid-3, .control-grid, .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .nav { flex-wrap: wrap; }
  .content { padding: 24px 20px; }
  .header { flex-direction: column; gap: 12px; padding: 12px 16px; height: auto; }
}

@media (max-width: 640px) {
  .grid-3, .grid-2, .control-grid, .kpi-grid { grid-template-columns: 1fr; }
  .section-title { font-size: 30px; }
}
`;

// ── Map Component ─────────────────────────────────────────────────
function CircuitMap() {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then(r => r.json())
      .then(topo => {
        const topojson = window.topojsonOrFallback;
        if (typeof topojson !== "undefined") {
          setGeoData(topojson.feature(topo, topo.objects.states));
        } else {
          import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm").then(mod => {
            setGeoData(mod.feature(topo, topo.objects.states));
          });
        }
      })
      .catch(() => {});
  }, []);

  const projection = d3.geoAlbersUsa().scale(1100).translate([480, 300]);
  const pathGen = d3.geoPath().projection(projection);

  const handleNodeHover = useCallback((node, e) => {
    setTooltip({ ...node, x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <div className="map-container">
        <svg ref={svgRef} className="map-svg" viewBox="0 0 960 600">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4A574" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
            </radialGradient>
          </defs>
          {geoData && geoData.features.map((f, i) => {
            const fips = f.id;
            const circuit = fipsToCircuit[fips];
            return (
              <path
                key={i}
                className="state"
                d={pathGen(f) || ""}
                fill={circuit ? circuit.color + "88" : "#2A3A4E"}
                onMouseEnter={() => {}}
              />
            );
          })}
          {NODES.map((n, i) => {
            const pos = projection([n.lng, n.lat]);
            if (!pos) return null;
            return (
              <g key={i}>
                <circle cx={pos[0]} cy={pos[1]} r={14} fill="url(#glow)" />
                <circle
                  className="node-dot"
                  cx={pos[0]}
                  cy={pos[1]}
                  r={5}
                  fill="#D4A574"
                  stroke="#0A0E17"
                  strokeWidth={2}
                  onMouseEnter={(e) => handleNodeHover(n, e)}
                  onMouseLeave={() => setTooltip(null)}
                />
                {n.circuit === "9th (Base)" && (
                  <text x={pos[0] + 10} y={pos[1] - 10} fill="#D4A574" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">HQ</text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="map-legend">
          {CIRCUITS.filter(c => c.id !== "D.C.").map(c => (
            <div key={c.id} className="legend-item">
              <div className="legend-swatch" style={{ background: c.color }} />
              {c.id} Circuit
            </div>
          ))}
        </div>
      </div>
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x + 16, top: tooltip.y - 10 }}>
          <div className="tooltip-city">{tooltip.city}</div>
          <div className="tooltip-circuit">{tooltip.circuit} Circuit</div>
          <div className="tooltip-text">{tooltip.rationale}</div>
        </div>
      )}
    </>
  );
}

// ── Section Components ────────────────────────────────────────────
function OverviewSection() {
  return (
    <div>
      <h1 className="section-title">Ngehsi Brendan Ngwa Nforbi, Attorneys at Law — Unified Business Plan</h1>
      <p className="section-subtitle">
        An AI-native, multi-track plaintiff litigation firm built to collapse the cost of legal production while
        capturing underserved markets in civil rights, state torts, and immigration law. Compliance-first.
        Settlement-driven. Nationally scalable.
      </p>

      <div className="grid-3">
        <div className="card">
          <div className="card-label">Structure</div>
          <div className="card-value">DE PLLC</div>
          <div className="card-desc">Delaware Professional LLC registered as foreign PC in California and expansion states. All equity with licensed attorneys (Rule 5.4).</div>
        </div>
        <div className="card">
          <div className="card-label">Capitalization</div>
          <div className="card-value">BTC Treasury</div>
          <div className="card-desc">Phased Bitcoin liquidation funds the 12–36 month contingency-fee lag. Max 30% crypto exposure. IOLTA strictly segregated.</div>
        </div>
        <div className="card">
          <div className="card-label">Expansion</div>
          <div className="card-value">13 Circuits</div>
          <div className="card-desc">Circuit-node model: virtual offices with salaried attorneys in every federal appellate circuit. Local counsel for state courts.</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="pillar">
          <div className="pillar-num">PILLAR I</div>
          <div className="pillar-title">Federal Civil Rights and State Accountability</div>
          <div className="pillar-text">
            42 U.S.C. §1983 actions, police misconduct, prisoner rights, and Monell municipal liability.
            Multi-track deployment: concurrent federal constitutional claims, state torts, and administrative
            complaints to compound settlement pressure across forums.
          </div>
        </div>
        <div className="pillar">
          <div className="pillar-num">PILLAR II</div>
          <div className="pillar-title">High-Volume Immigration and Deportation Defense</div>
          <div className="pillar-text">
            Asylum, deportation defense, employment visas, APA/Mandamus lawsuits against processing delays.
            AI-powered multilingual intake, OCR document processing, and rapid brief generation within
            the 10-day BIA appeal window.
          </div>
        </div>
      </div>

      <div className="card" style={{ borderLeft: "3px solid var(--accent)" }}>
        <div className="card-label">Core Constraint</div>
        <div className="card-desc" style={{ fontSize: "14px", lineHeight: "1.7" }}>
          The binding limitation is not how much AI can be deployed, but whether it can be deployed
          without compromising confidentiality and supervision duties (ABA Formal Opinion 512),
          trust-accounting and client-fund controls (California Rule 1.15 / CTAPP), and the duty of
          competence with technology (California Rule 1.1). Every operational decision is subordinate
          to these constraints.
        </div>
      </div>
    </div>
  );
}

function MapSection() {
  return (
    <div>
      <h1 className="section-title">Circuit-Node Expansion Map</h1>
      <p className="section-subtitle">
        Strategic anchor cities across all 13 federal circuits. Each node sits at the intersection of federal
        court power, high civil rights violation density, and underserved populations. Hover over any dot to
        see the strategic rationale.
      </p>
      <CircuitMap />
      <table className="data-table">
        <thead>
          <tr>
            <th>Circuit</th>
            <th>Anchor City</th>
            <th>Strategic Rationale</th>
          </tr>
        </thead>
        <tbody>
          {NODES.map((n, i) => (
            <tr key={i}>
              <td>{n.circuit}</td>
              <td>{n.city}</td>
              <td>{n.rationale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhasesSection() {
  const [expanded, setExpanded] = useState(0);
  return (
    <div>
      <h1 className="section-title">Phased Operating Blueprint</h1>
      <p className="section-subtitle">
        Four sequential phases, each with defined objectives, deliverables, staffing sequences, budget
        bands, and go/no-go triggers. Click any phase to expand.
      </p>
      <div className="phase-timeline">
        {PHASE_DATA.map((p, i) => (
          <div key={i} className={`phase-card ${expanded === i ? "active" : ""}`} onClick={() => setExpanded(expanded === i ? -1 : i)}>
            <div className="phase-dot" style={{ background: p.color }}>{i}</div>
            <div className="phase-body">
              <div className="phase-header">
                <span className="phase-name">{p.phase}</span>
                <span className="phase-sub">{p.subtitle}</span>
              </div>
              <div className="phase-time">{p.timeline}</div>
              <div className={`phase-detail ${expanded === i ? "expanded" : "collapsed"}`}>
                <div className="detail-section">
                  <div className="detail-label">Objectives</div>
                  <ul className="detail-list">
                    {p.objectives.map((o, j) => <li key={j}>{o}</li>)}
                  </ul>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Key Deliverables</div>
                  <ul className="detail-list">
                    {p.deliverables.map((d, j) => <li key={j}>{d}</li>)}
                  </ul>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Budget Bands</div>
                  <div className="budget-row">
                    <span className="budget-tag">Low: {p.budget.low}</span>
                    <span className="budget-tag">Mid: {p.budget.mid}</span>
                    <span className="budget-tag">High: {p.budget.high}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Staffing</div>
                  <div style={{ fontSize: "13px", color: "var(--text2)" }}>{p.team}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Go / No-Go Trigger</div>
                  <div className="trigger-box">{p.trigger}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngineSection() {
  const controls = [
    { num: "01", title: "Tool Allowlist", desc: "Green (public), Yellow (de-identified client data), Red (privileged/PII — vetted tools only)." },
    { num: "02", title: "Mandatory Verification", desc: "No filing without cite verification, quote verification, and record cross-check." },
    { num: "03", title: "Work-Product Labeling", desc: "All AI-assisted drafts labeled in DMS so future users understand fallibility." },
    { num: "04", title: "Client Consent Gate", desc: "Informed consent for inputting representation information into GAI tools." },
    { num: "05", title: "Billing Integrity", desc: "Bill actual human time only. 15 min prompting = 15 min billed." },
    { num: "06", title: "Supervision", desc: "Nonlawyers using AI must be trained and supervised. Managerial policies mandatory." },
  ];

  return (
    <div>
      <h1 className="section-title">AI-Native Operations Engine</h1>
      <p className="section-subtitle">
        A three-layer litigation production system augmented by agentic AI. The baseline rule:
        AI can draft; lawyers must decide and certify.
      </p>

      <div className="layer-stack">
        {[
          { badge: "LAYER 1", title: "Input — Intake and Fact Capture", text: "Automated intake funnels with practice-specific AI dialogue. Extracts key facts, generates viability scores via proprietary rubric, presents structured summaries to human attorneys for final acceptance." },
          { badge: "LAYER 2", title: "Processing — AI Workflow and Discovery", text: "Centralized case management with agentic extraction from evidence. Research agents monitor dockets, calculate deadlines, perform multi-jurisdictional research. All outputs cross-referenced against validation systems." },
          { badge: "LAYER 3", title: "Output — Court-Ready Production", text: "Drafting agents construct rule-compliant pleadings, demands, and discovery responses adapted to jurisdiction-specific requirements. Single operator produces output traditionally requiring 5 associates and 3 paralegals." },
        ].map((l, i) => (
          <div key={i} className="layer">
            <span className="layer-badge">{l.badge}</span>
            <div className="layer-content">
              <h4>{l.title}</h4>
              <p>{l.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", color: "var(--text)", marginBottom: "20px" }}>
        Six Enforceable AI Controls
      </h2>
      <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px" }}>
        Derived from ABA Formal Opinion 512 and operationalized as firm-wide policy.
      </p>
      <div className="control-grid">
        {controls.map((c, i) => (
          <div key={i} className="control-card">
            <div className="control-num">{c.num}</div>
            <div className="control-title">{c.title}</div>
            <div className="control-desc">{c.desc}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", color: "var(--text)", marginBottom: "20px" }}>
        Strategic Tech Stack
      </h2>
      <table className="data-table">
        <thead>
          <tr><th>Category</th><th>Primary Tool</th><th>Role</th></tr>
        </thead>
        <tbody>
          {[
            ["Practice Management", "Clio", "System of record — billing, calendaring, SOC-reported security"],
            ["Trust Payments", "LawPay", "IOLTA-safe processing — fees never debited from trust"],
            ["Legal AI Research", "CoCounsel / Protégé", "Deep research with citation validation"],
            ["Draft Augmentation", "Harvey / Spellbook", "Jurisdiction-adaptive drafting (strict vetting required)"],
            ["Doc Automation", "Gavel", "Intake-to-document pipeline"],
            ["E-Signature", "DocuSign", "Trust center and security-published"],
            ["Integration", "Zapier / Make", "Workflow orchestration (SOC 2 compliant)"],
            ["Platform", "M365 / Google Workspace", "MFA enforced, encryption at rest + in transit"],
            ["Passwords", "1Password", "E2E encrypted credential management"],
          ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function FinanceSection() {
  const [finTab, setFinTab] = useState("flagship");
  const finTabs = [
    { key: "flagship", label: "Stockton Flagship" },
    { key: "network", label: "13-Node Network" },
    { key: "supplemental", label: "Supplemental Costs" },
    { key: "grand", label: "Grand Total" },
  ];

  return (
    <div>
      <h1 className="section-title">36-Month Financial Model</h1>
      <p className="section-subtitle">
        Full deployment from day one — Year 3 staffing as Year 1 across all 13 circuit nodes.
        Bitcoin treasury capitalization with strict IOLTA segregation. All figures assume max output for 36 months.
      </p>

      <div className="grid-3" style={{ marginBottom: "32px" }}>
        <div className="card">
          <div className="card-label">Treasury Rule</div>
          <div className="card-value" style={{ fontSize: "26px" }}>≤ 30% Crypto</div>
          <div className="card-desc">Maximum crypto exposure at any time. Phased liquidation smooths tax liability. Institutional custody required.</div>
        </div>
        <div className="card">
          <div className="card-label">IOLTA Discipline</div>
          <div className="card-value" style={{ fontSize: "26px" }}>3-Way Recon</div>
          <div className="card-desc">Monthly reconciliation: client ledger, firm journal, bank statement. CTAPP requires annual reporting even without funds on deposit.</div>
        </div>
        <div className="card">
          <div className="card-label">BTC Reserves Required</div>
          <div className="card-value" style={{ fontSize: "26px" }}>$36M–$42M</div>
          <div className="card-desc">Liquidatable Bitcoin to fund 36 months safely, including capital gains tax on conversion, case-cost float, and 6-month emergency cushion.</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2px", background: "var(--bg2)", borderRadius: "10px", padding: "3px", marginBottom: "32px" }}>
        {finTabs.map(t => (
          <button key={t.key} onClick={() => setFinTab(t.key)} style={{
            background: finTab === t.key ? "var(--surface)" : "none",
            border: "none", color: finTab === t.key ? "var(--accent)" : "var(--text2)",
            padding: "10px 18px", borderRadius: "8px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: "600",
            transition: "all 0.25s", boxShadow: finTab === t.key ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {finTab === "flagship" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Stockton Flagship — 36-Month Staffing
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            Full boutique team from day one: 8 people including founder. All salaries are Stockton/Central Valley market rates,
            fully loaded at ~30% for payroll taxes, workers' comp, health insurance, and benefits. Includes 3–4% annual raises.
          </p>

          <table className="data-table">
            <thead>
              <tr><th>Role</th><th>Base Salary</th><th>Loaded Annual</th><th>36-Month Total</th></tr>
            </thead>
            <tbody>
              {[
                ["Managing Attorney (Founder)", "$150,000", "$195,000", "$585,000"],
                ["Associate Attorney #1", "$110,000", "$143,000", "$429,000"],
                ["Associate Attorney #2", "$110,000", "$143,000", "$429,000"],
                ["Litigation Paralegal (FT)", "$65,000", "$84,000", "$252,000"],
                ["Intake / Case Manager (FT)", "$55,000", "$71,000", "$213,000"],
                ["Damages / Recovery Specialist", "$72,000", "$93,000", "$279,000"],
                ["Trust Bookkeeper (FT)", "$52,000", "$67,000", "$201,000"],
                ["Contract Investigator", "$30,000 (contract)", "$30,000", "$90,000"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL STAFFING</td>
                <td>$644,000</td>
                <td>$826,000/yr</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$2.55M–$2.65M</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Compute, AI Tooling, and SaaS
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px" }}>
            Full seats from day one for all 8 team members.
          </p>
          <table className="data-table">
            <thead>
              <tr><th>Tool / Category</th><th>Annual Cost</th><th>36-Month Total</th></tr>
            </thead>
            <tbody>
              {[
                ["Clio (8 users, top tier)", "$16,000", "$48,000"],
                ["CoCounsel or Protégé (3 attorneys)", "$24,000–$30,000", "$72,000–$90,000"],
                ["Harvey / Spellbook (2 seats)", "$9,000–$12,000", "$27,000–$36,000"],
                ["API Compute (custom workflows)", "$18,000–$24,000", "$54,000–$72,000"],
                ["Gavel (doc automation)", "$5,000", "$15,000"],
                ["DocuSign (team plan)", "$4,000", "$12,000"],
                ["M365 / Google Workspace (8 users)", "$2,500", "$7,500"],
                ["1Password + Zapier/Make + misc SaaS", "$3,000", "$9,000"],
                ["Cloud backup, MDM, security tooling", "$5,000–$6,000", "$15,000–$18,000"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL COMPUTE</td>
                <td>$87K–$100K/yr</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$260K–$300K</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Flagship 36-Month Summary
          </h2>
          <div className="grid-2">
            {[
              { label: "Staffing (loaded)", value: "$2.55M–$2.65M" },
              { label: "Compute & AI Tools", value: "$260K–$300K" },
              { label: "Office & Overhead", value: "$120K–$180K" },
              { label: "Case-Cost Float (recoverable)", value: "$600K–$800K" },
            ].map((c, i) => (
              <div key={i} className="card">
                <div className="card-label">{c.label}</div>
                <div className="card-value" style={{ fontSize: "24px" }}>{c.value}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ borderLeft: "3px solid var(--accent)", marginTop: "16px" }}>
            <div className="card-label">Flagship Total Cash Requirement</div>
            <div className="card-value" style={{ fontSize: "28px" }}>$4.5M–$5.0M</div>
            <div className="card-desc">Includes recoverable case-cost float. True irreversible burn: $3.08M–$3.24M. BTC reserves needed: $5.5M–$6M (with tax and cushion).</div>
          </div>
        </div>
      )}

      {finTab === "network" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Tiered Node Architecture
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            Not all 13 nodes are identical. The network is tiered by case density and strategic value.
            Centralized HQ functions (finance, intake, AI stack) serve all nodes and don't multiply by 13.
          </p>

          <div className="grid-3" style={{ marginBottom: "32px" }}>
            <div className="card" style={{ borderTop: "3px solid #E8927C" }}>
              <div className="card-label">Tier 1 — Flagship</div>
              <div className="card-value" style={{ fontSize: "22px" }}>1 Node</div>
              <div className="card-desc" style={{ marginBottom: "12px" }}>Stockton, CA (HQ). Full 8-person team, complete infrastructure, your physical base.</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "var(--accent)", padding: "8px 12px", background: "var(--bg3)", borderRadius: "6px" }}>
                $4.5M–$5.0M / 36 mo
              </div>
            </div>
            <div className="card" style={{ borderTop: "3px solid #7EC8E3" }}>
              <div className="card-label">Tier 2 — Heavy Nodes</div>
              <div className="card-value" style={{ fontSize: "22px" }}>5 Nodes</div>
              <div className="card-desc" style={{ marginBottom: "12px" }}>NYC, Chicago, Houston, Atlanta/Miami, Washington D.C. Two associates, one paralegal each. Lean on HQ for back-office.</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "var(--accent)", padding: "8px 12px", background: "var(--bg3)", borderRadius: "6px" }}>
                $1.41M–$1.56M each
              </div>
            </div>
            <div className="card" style={{ borderTop: "3px solid #A8D5BA" }}>
              <div className="card-label">Tier 3 — Light Nodes</div>
              <div className="card-value" style={{ fontSize: "22px" }}>7 Nodes</div>
              <div className="card-desc" style={{ marginBottom: "12px" }}>Boston, Philly/Newark, Alexandria/Baltimore, Detroit, St. Louis, Denver/ABQ, Sacramento. One associate, part-time paralegal.</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "var(--accent)", padding: "8px 12px", background: "var(--bg3)", borderRadius: "6px" }}>
                $702K–$753K each
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Per-Node Cost Breakdown (36 months)
          </h2>
          <table className="data-table">
            <thead>
              <tr><th>Cost Category</th><th>Tier 2 (per node)</th><th>Tier 3 (per node)</th></tr>
            </thead>
            <tbody>
              {[
                ["Associates (loaded)", "$286K (2 attorneys)", "$143K (1 attorney)"],
                ["Paralegal (loaded)", "$84K (1 FT)", "$42K (0.5 FT)"],
                ["Office Lease", "$60K–$96K/yr", "$24K–$36K/yr"],
                ["Malpractice & Insurance", "$25K–$35K/yr", "$15K–$20K/yr"],
                ["Local Overhead & Supplies", "$15K–$20K/yr", "$10K/yr"],
                ["Annual Per-Node Cost", "$470K–$520K", "$234K–$251K"],
                ["36-Month Per-Node Burn", "$1.41M–$1.56M", "$702K–$753K"],
                ["Case-Cost Float (per node)", "$400K–$600K", "$200K–$400K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
            </tbody>
          </table>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Centralized HQ Functions (36 months)
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px" }}>
            These costs serve the entire network from Stockton and don't multiply by 13.
          </p>
          <table className="data-table">
            <thead>
              <tr><th>HQ Function</th><th>36-Month Cost</th></tr>
            </thead>
            <tbody>
              {[
                ["Founder Draw (loaded)", "$585,000"],
                ["Finance & Trust Team (controller + 2 staff)", "$520,000"],
                ["Centralized Intake & Ops Manager", "$250,000"],
                ["National Marketing & SEO", "$540K–$1.08M"],
                ["Centralized AI & Compute Stack (~40 users)", "$350K–$420K"],
                ["National Malpractice Umbrella & E&O", "$240K–$360K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL CENTRALIZED HQ</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$2.49M–$3.22M</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Network Workforce at Full Deployment
          </h2>
          <div className="grid-2">
            <div className="card">
              <div className="card-label">Total Headcount</div>
              <div className="card-value">45–50</div>
              <div className="card-desc">1 founder + 26 associates + 7–8 paralegals + 5–6 HQ staff + damages specialists + contract investigators</div>
            </div>
            <div className="card">
              <div className="card-label">Monthly Network Burn</div>
              <div className="card-value" style={{ fontSize: "28px" }}>$620K–$750K</div>
              <div className="card-desc">Blended across all 13 nodes + HQ. Breakeven target: month 18–24 via settlement revenue at 5–8 resolutions/month network-wide.</div>
            </div>
          </div>
        </div>
      )}

      {finTab === "supplemental" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Supplemental Cost Categories
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            Costs not captured in core staffing, compute, or marketing. These can move the total meaningfully
            and should be budgeted explicitly rather than absorbed as surprises.
          </p>

          <table className="data-table">
            <thead>
              <tr><th>Category</th><th>Details</th><th>36-Month Cost</th></tr>
            </thead>
            <tbody>
              {[
                ["Bar Admissions & Pro Hac Vice", "State bar apps ($500–$2,500 each), pro hac vice motions ($250–$500/case/jurisdiction) across 13 states", "$80K–$150K"],
                ["Expert Witness Retainers", "Use-of-force, medical, economics, immigration policy experts at $15K–$50K per engagement. ~20% of active cases.", "$200K–$500K"],
                ["CLE & AI Competency Training", "Mandatory per ABA 512 and CA Rule 1.1. $2K–$4K per attorney/year × 28 attorneys.", "$168K–$336K"],
                ["Translation & Interpreter Services", "Certified human interpreters for depositions, hearings, consultations beyond AI coverage. Dozens of languages for asylum cases.", "$108K–$216K"],
                ["E-Discovery & Doc Hosting", "Relativity/Everlaw hosting for document-heavy cases against institutional defendants. Body camera footage alone can be terabytes.", "$100K–$250K"],
                ["Travel", "Court appearances, depositions, client meetings, inter-node travel across 13 cities. $3K–$5K/month network-wide.", "$108K–$180K"],
                ["Recruiting", "Legal recruiters at 15–25% of first-year salary for ~13 associate placements + support staff across 13 markets.", "$250K–$450K"],
                ["Tax, Accounting & Corporate Legal", "Multi-state PLLC tax filings, franchise taxes, registered agents, outside corporate counsel. $60K–$100K/year.", "$180K–$300K"],
                ["Custom Tech Development", "Proprietary intake portals, internal dashboards, case scoring algorithms. Initial build + maintenance.", "$122K–$330K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL SUPPLEMENTAL</td>
                <td></td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$1.32M–$2.71M</td>
              </tr>
            </tbody>
          </table>

          <div className="card" style={{ borderLeft: "3px solid var(--accent2)", marginTop: "24px" }}>
            <div className="card-label">Midpoint Estimate</div>
            <div className="card-value" style={{ fontSize: "28px" }}>~$2.1M</div>
            <div className="card-desc">The supplemental layer is often where startup law firms get blindsided. Pricing these explicitly — especially expert witnesses, recruiting, and multi-state tax compliance — prevents cash crunches that force bad case-selection decisions.</div>
          </div>
        </div>
      )}

      {finTab === "grand" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Fully Loaded 36-Month Financial Summary
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            All 13 nodes at full deployment from day one. Year 3 staffing as Year 1 for 36 months.
          </p>

          <table className="data-table">
            <thead>
              <tr><th>Cost Layer</th><th>Low Estimate</th><th>High Estimate</th></tr>
            </thead>
            <tbody>
              {[
                ["Stockton Flagship (burn + float)", "$4.50M", "$5.00M"],
                ["5 Tier-2 Heavy Nodes (burn + float)", "$9.05M", "$10.80M"],
                ["7 Tier-3 Light Nodes (burn + float)", "$6.31M", "$8.07M"],
                ["Centralized HQ Functions", "$2.49M", "$3.22M"],
                ["Marketing & Client Acquisition", "$5.00M", "$5.50M"],
                ["Supplemental Costs", "$1.32M", "$2.71M"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>GRAND TOTAL (36 months)</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$28.67M</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$35.30M</td>
              </tr>
            </tbody>
          </table>

          <div className="grid-3" style={{ marginTop: "28px" }}>
            <div className="card" style={{ borderTop: "3px solid #A8D5BA" }}>
              <div className="card-label">Recoverable Float</div>
              <div className="card-value" style={{ fontSize: "24px" }}>$4.5M–$7.0M</div>
              <div className="card-desc">Case-cost float returns through settlements. Expert retainers, filing fees, deposition costs — all recovered from case proceeds.</div>
            </div>
            <div className="card" style={{ borderTop: "3px solid #E8927C" }}>
              <div className="card-label">True Irreversible Burn</div>
              <div className="card-value" style={{ fontSize: "24px" }}>$24.1M–$28.6M</div>
              <div className="card-desc">Money spent and gone: salaries, rent, tools, marketing, overhead. This is the real capital consumption over 36 months.</div>
            </div>
            <div className="card" style={{ borderTop: "3px solid var(--accent)" }}>
              <div className="card-label">BTC Reserves Required</div>
              <div className="card-value" style={{ fontSize: "24px" }}>$36M–$42M</div>
              <div className="card-desc">Accounts for 20–25% capital gains tax on BTC liquidation, conversion costs, and a 6-month emergency cushion beyond the 36-month plan.</div>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Revenue Required to Sustain
          </h2>
          <div className="grid-2">
            <div className="card">
              <div className="card-label">Monthly Network Burn</div>
              <div className="card-value" style={{ fontSize: "24px" }}>$620K–$750K</div>
              <div className="card-desc">Blended all-in monthly cost across 13 nodes, HQ, marketing, and supplemental. This is the number settlement revenue must match by month 18–24.</div>
            </div>
            <div className="card">
              <div className="card-label">Breakeven Math</div>
              <div className="card-value" style={{ fontSize: "24px" }}>5–8 cases/mo</div>
              <div className="card-desc">At 33–40% contingency on $150K–$500K settlements ($50K–$200K fee per case), 5–8 monthly resolutions network-wide reaches breakeven.</div>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Cash Flow Timeline
          </h2>
          <table className="data-table">
            <thead>
              <tr><th>Period</th><th>Cumulative Burn</th><th>Expected Revenue</th><th>Net Position</th></tr>
            </thead>
            <tbody>
              {[
                ["Months 1–6", "~$4.5M", "$0 (pre-settlement)", "–$4.5M"],
                ["Months 7–12", "~$9.0M", "$0–$500K (first settlements)", "–$8.5M to –$9.0M"],
                ["Months 13–18", "~$13.5M", "$1M–$3M (pipeline producing)", "–$10.5M to –$12.5M"],
                ["Months 19–24", "~$18.0M", "$3M–$7M (acceleration)", "–$11M to –$15M"],
                ["Months 25–30", "~$22.5M", "$7M–$14M (mature pipeline)", "–$8.5M to –$15.5M"],
                ["Months 31–36", "~$27.0M", "$12M–$22M (full velocity)", "–$5M to –$15M"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
            </tbody>
          </table>
          <div className="card" style={{ borderLeft: "3px solid var(--accent)", marginTop: "16px" }}>
            <div className="card-label">Dead Zone Warning</div>
            <div className="card-desc" style={{ fontSize: "14px", lineHeight: "1.7" }}>
              Months 1–18 are the survival gauntlet. The firm burns ~$13.5M before meaningful settlement revenue begins.
              The Bitcoin treasury must absorb this without forcing desperate case selection or premature node closures.
              The firm that survives the dead zone owns the market position — but only disciplined case underwriting
              and AI-augmented production speed can compress the timeline.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketingSection() {
  const [mktTab, setMktTab] = useState("digital");
  const mktTabs = [
    { key: "digital", label: "Digital Dominance" },
    { key: "community", label: "Community & Referrals" },
    { key: "brand", label: "Brand Visibility" },
    { key: "budget", label: "Full Budget" },
  ];

  return (
    <div>
      <h1 className="section-title">Marketing & Client Acquisition</h1>
      <p className="section-subtitle">
        An aggressive initial campaign across 13 markets. Three-layer architecture: digital dominance (SEO + paid search + social),
        community presence and referral networks, and physical brand visibility. Total 36-month investment: $5.0M–$5.5M.
      </p>

      <div className="grid-3" style={{ marginBottom: "28px" }}>
        <div className="card">
          <div className="card-label">Target Client Profile</div>
          <div className="card-value" style={{ fontSize: "20px" }}>People in Crisis</div>
          <div className="card-desc">Searching Google at 2 AM, asking community members they trust, or seeing the firm's name in their neighborhood. Not browsing LinkedIn.</div>
        </div>
        <div className="card">
          <div className="card-label">Competitive Edge</div>
          <div className="card-value" style={{ fontSize: "20px" }}>Speed to Convert</div>
          <div className="card-desc">AI intake funnel converts leads in minutes vs. competitors' next-morning callback. Speed-to-response can double or triple conversion rates.</div>
        </div>
        <div className="card">
          <div className="card-label">Spend Cadence</div>
          <div className="card-value" style={{ fontSize: "20px" }}>Front-Loaded</div>
          <div className="card-desc">~35% of budget in months 1–6 (launch blitz), ~40% months 7–18 (sustained high), ~25% months 19–36 (organic takes over).</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2px", background: "var(--bg2)", borderRadius: "10px", padding: "3px", marginBottom: "32px" }}>
        {mktTabs.map(t => (
          <button key={t.key} onClick={() => setMktTab(t.key)} style={{
            background: mktTab === t.key ? "var(--surface)" : "none",
            border: "none", color: mktTab === t.key ? "var(--accent)" : "var(--text2)",
            padding: "10px 18px", borderRadius: "8px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: "600",
            transition: "all 0.25s", boxShadow: mktTab === t.key ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {mktTab === "digital" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div className="layer-stack">
            <div className="layer">
              <span className="layer-badge">SEO</span>
              <div className="layer-content">
                <h4>Search Engine Optimization — The Long Game</h4>
                <p>
                  Dedicated legal SEO agency (Rankings.io or Mockingbird Marketing caliber). 30–40 long-form articles/month
                  across 13 markets targeting high-intent queries: "police misconduct lawyer [city]," "asylum delay lawsuit,"
                  "wrongful termination California." Each page feeds the AI intake funnel. One in-house content manager
                  plus freelance legal writers for jurisdiction-specific pieces.
                </p>
              </div>
            </div>
            <div className="layer">
              <span className="layer-badge">PPC</span>
              <div className="layer-content">
                <h4>Google Ads — Immediate Pipeline Filler</h4>
                <p>
                  Launch in all 13 markets simultaneously on day one. Legal keywords run $30–$150/click ("police brutality lawyer"
                  = $50–$150, "immigration lawyer" = $30–$80). High-intent keywords only. The AI intake funnel is the conversion
                  weapon — instant triage vs. competitors' next-morning callback. Taper as organic rankings mature.
                </p>
              </div>
            </div>
            <div className="layer">
              <span className="layer-badge">SOCIAL</span>
              <div className="layer-content">
                <h4>Social Media — Awareness & Trust</h4>
                <p>
                  Facebook/Instagram (community reach, immigration populations), YouTube (pre-roll, explainers),
                  TikTok (younger demographics, civil rights awareness). Not direct lead gen — trust-building.
                  Attorneys become recognizable faces. Short-form know-your-rights content cross-posted as SEO fuel.
                  One videographer/editor producing templated content localized across markets.
                </p>
              </div>
            </div>
          </div>

          <table className="data-table" style={{ marginTop: "24px" }}>
            <thead>
              <tr><th>Digital Channel</th><th>Monthly Spend</th><th>36-Month Total</th></tr>
            </thead>
            <tbody>
              {[
                ["SEO Agency Retainer + Technical SEO", "$15K–$25K", "$540K–$900K"],
                ["Content Production (manager + writers)", "$8K–$12K", "$288K–$432K"],
                ["Google Ads (13 markets, tapered)", "$15K–$50K (varies by phase)", "$780K–$1.32M"],
                ["Social Media Ads (FB/IG/YT/TikTok)", "$8K–$15K", "$288K–$540K"],
                ["Video Production", "$3K–$6K", "$108K–$216K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL DIGITAL</td>
                <td></td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$2.00M–$3.41M</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {mktTab === "community" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Community Presence & Referral Networks
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            The highest-converting, lowest-cost leads come from community trust. These take time but create
            compounding returns that paid ads never will.
          </p>

          <div className="grid-2" style={{ marginBottom: "28px" }}>
            <div className="card" style={{ borderLeft: "3px solid var(--accent2)" }}>
              <div className="card-label">Civil Rights Referral Network</div>
              <ul className="detail-list">
                <li>Local NAACP chapters and ACLU affiliates</li>
                <li>Public defender offices and community bail funds</li>
                <li>Police accountability organizations</li>
                <li>Local elected officials and community leaders</li>
                <li>Know-your-rights workshops (double as lead gen)</li>
              </ul>
            </div>
            <div className="card" style={{ borderLeft: "3px solid #7EC8E3" }}>
              <div className="card-label">Immigration Referral Network</div>
              <ul className="detail-list">
                <li>Immigrant advocacy organizations</li>
                <li>Churches with large immigrant congregations</li>
                <li>Ethnic community associations and consulates</li>
                <li>Legal aid orgs that can't take the volume</li>
                <li>Community fairs and cultural markets</li>
              </ul>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr><th>Community Channel</th><th>Monthly Spend</th><th>36-Month Total</th></tr>
            </thead>
            <tbody>
              {[
                ["Community Engagement (13 nodes × $1.5K–$3K/mo)", "$19.5K–$39K", "$702K–$1.40M"],
                ["Free Consultation Infrastructure (virtual tools, interpreters, follow-up)", "$2K–$4K", "$72K–$144K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL COMMUNITY</td>
                <td></td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$774K–$1.54M</td>
              </tr>
            </tbody>
          </table>

          <div className="card" style={{ borderLeft: "3px solid var(--accent)", marginTop: "20px" }}>
            <div className="card-label">Key Insight</div>
            <div className="card-desc" style={{ fontSize: "14px", lineHeight: "1.7" }}>
              Free consultations must be genuinely valuable — not a sales pitch. The client should leave understanding
              their rights and options whether or not they sign. Word-of-mouth from generous consultations is marketing
              gold in underserved communities. Each node attorney should be attending community meetings, speaking at
              events, and building a reputation as the person who actually fights.
            </div>
          </div>
        </div>
      )}

      {mktTab === "brand" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Physical Brand Visibility & PR
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            Most expensive layer, most debatable — but establishes legitimacy that digital alone can't.
            Selective deployment in tier-2 markets where case density justifies the spend.
          </p>

          <div className="grid-3" style={{ marginBottom: "28px" }}>
            {[
              { label: "Billboards & Transit", desc: "Billboard near Cook County jail. Bus ads in Brooklyn and the Bronx. Heavy rotation 3–4 months, then quarterly pulses. 5 tier-2 markets only.", cost: "$150K–$350K/yr" },
              { label: "Spanish-Language Radio", desc: "Houston, Miami, New York, Chicago, LA overflow. Pulsed campaigns targeting immigrant communities on trusted stations.", cost: "$90K–$240K/yr" },
              { label: "Legal PR Retainer", desc: "Every significant filing, settlement, or civil rights victory generates press. Legal PR firm places stories in local media and national outlets. The 'Guerrilla Litigation' brand is a story journalists want to tell.", cost: "$72K–$144K/yr" },
            ].map((c, i) => (
              <div key={i} className="card">
                <div className="card-label">{c.label}</div>
                <div className="card-desc" style={{ marginBottom: "12px" }}>{c.desc}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "var(--accent)", padding: "6px 10px", background: "var(--bg3)", borderRadius: "6px", display: "inline-block" }}>
                  {c.cost}
                </div>
              </div>
            ))}
          </div>

          <table className="data-table">
            <thead>
              <tr><th>Brand Channel</th><th>Annual Spend</th><th>36-Month Total</th></tr>
            </thead>
            <tbody>
              {[
                ["Billboards & Transit (5 tier-2 markets, pulsed)", "$150K–$350K", "$450K–$1.05M"],
                ["Spanish-Language & Community Radio", "$90K–$240K", "$270K–$720K"],
                ["Legal PR Firm Retainer", "$60K–$120K", "$180K–$360K"],
                ["Press Release Distribution & Media Monitoring", "$12K–$24K", "$36K–$72K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL BRAND VISIBILITY</td>
                <td></td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$936K–$2.20M</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {mktTab === "budget" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px" }}>
            Full 36-Month Marketing Budget
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px", lineHeight: "1.7" }}>
            Recommended allocation: $5.0M–$5.5M over 36 months, front-loaded for launch impact.
          </p>

          <table className="data-table">
            <thead>
              <tr><th>Layer</th><th>Low Estimate</th><th>High Estimate</th></tr>
            </thead>
            <tbody>
              {[
                ["SEO & Content Production", "$828K", "$1.33M"],
                ["Paid Search (Google Ads)", "$780K", "$1.32M"],
                ["Social Media Ads + Video Production", "$396K", "$756K"],
                ["Community Engagement (13 nodes)", "$702K", "$1.40M"],
                ["Free Consultation Infrastructure", "$72K", "$144K"],
                ["Physical Advertising (billboards, transit, radio)", "$720K", "$1.77M"],
                ["PR & Earned Media", "$216K", "$432K"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              <tr style={{ borderTop: "2px solid var(--accent)" }}>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>TOTAL MARKETING</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$3.71M</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>$7.15M</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "var(--text)" }}>RECOMMENDED TARGET</td>
                <td colSpan={2} style={{ fontWeight: 700, color: "var(--accent)", textAlign: "center" }}>$5.0M–$5.5M</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "8px", marginTop: "32px" }}>
            Spend Phasing
          </h2>
          <table className="data-table">
            <thead>
              <tr><th>Period</th><th>% of Budget</th><th>Monthly Spend</th><th>Focus</th></tr>
            </thead>
            <tbody>
              {[
                ["Months 1–6 (Launch Blitz)", "~35%", "$290K–$320K/mo", "Google Ads maxed, SEO full speed, community overdrive, physical ads in rotation"],
                ["Months 7–18 (Sustained High)", "~40%", "$165K–$185K/mo", "Organic starting, paid search tapers where organic works, referral networks building"],
                ["Months 19–36 (Maintenance)", "~25%", "$70K–$80K/mo", "Organic is primary channel, paid fills gaps, community self-sustaining, physical is selective"],
              ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
            </tbody>
          </table>

          <div className="grid-2" style={{ marginTop: "24px" }}>
            <div className="card" style={{ borderLeft: "3px solid var(--accent)" }}>
              <div className="card-label">Brand Signal: Hope</div>
              <div className="card-desc" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                For victims of institutional abuse: "Someone will fight for you." Every piece of content, every community
                event, every intake interaction must reinforce that the firm exists to serve people the system has failed.
              </div>
            </div>
            <div className="card" style={{ borderLeft: "3px solid var(--accent2)" }}>
              <div className="card-label">Brand Signal: Accountability</div>
              <div className="card-desc" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                For institutions: "Guerrilla Litigation means multi-track, multi-forum, relentless pressure."
                The firm's reputation as a serious, technologically advanced adversary is itself a settlement accelerator.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplianceSection() {
  return (
    <div>
      <h1 className="section-title">Compliance, Ethics, and Security</h1>
      <p className="section-subtitle">
        ABA Formal Opinion 512, California Rule 1.15/CTAPP, NIST CSF 2.0, and CIS Controls —
        operationalized into enforceable SOPs.
      </p>

      <div className="grid-3">
        {[
          { label: "ABA 512", title: "AI Ethics", items: ["Competence with AI is ongoing", "No client data in unvetted tools", "Client disclosure baked into engagement", "Written AI policy mandatory", "Never file unverified output", "Bill actual human time only"] },
          { label: "Rule 1.15 / CTAPP", title: "Trust Accounting", items: ["Funds in labeled trust account", "No commingling — ever", "Monthly 3-way reconciliation", "CTAPP annual reporting", "Lien register for disputes", "Settlement SOP with holdback"] },
          { label: "CSF 2.0 + CIS", title: "Security Program", items: ["MFA on all accounts centrally", "Encrypted email/docs at rest + transit", "Password manager (E2E)", "Device encryption + remote wipe", "Immutable/versioned backups", "Breach inquiry + client notification"] },
        ].map((c, i) => (
          <div key={i} className="card" style={{ borderTop: "3px solid var(--accent)" }}>
            <div className="card-label">{c.label}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", marginBottom: "14px" }}>{c.title}</div>
            <ul className="detail-list">
              {c.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "20px" }}>
        Standard Operating Procedures
      </h2>
      <div className="grid-3">
        {[
          { title: "Intake → Sign", steps: ["Conflict check completed", "Disqualification gates cleared", "Underwriting score calculated", "Client objectives captured", "AI disclosure + consent captured", "Fee agreement executed", "Preservation letter queued"] },
          { title: "AI-Assisted Drafting", steps: ["Source bundle assembled", "AI output labeled in file system", "Citations validated in primary DB", "Quotes compared to source text", "Facts mapped to record cites", "Final human rewrite pass", "Filing checklist + deadline calendared"] },
          { title: "Settlement Disbursement", steps: ["Settlement statement + client approval", "Lien register updated", "Disputed funds held (Rule 1.15)", "Disbursement plan reviewed", "Trust ledger entries completed", "Journal updated; bank records saved", "3-way reconciliation archived"] },
        ].map((sop, i) => (
          <div key={i} className="card">
            <div className="card-label">SOP</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "18px", marginBottom: "12px" }}>{sop.title}</div>
            <ul className="detail-list">
              {sop.steps.map((s, j) => <li key={j}>{s}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPISection() {
  const kpis = [
    { label: "Intake Speed", p0: "Instrumented", p1: "Decreasing", p2: "Stable SLA" },
    { label: "Qualification Rate", p0: "Baseline set", p1: "Improving", p2: "Predictable" },
    { label: "Time to Leverage", p0: "Model defined", p1: "Consistent", p2: "Short + consistent" },
    { label: "Filing Quality", p0: "QA checklist", p1: "Zero uncited AI", p2: "Peer review" },
    { label: "Trust Close", p0: "Mock close", p1: "Monthly on time", p2: "Audit-ready" },
    { label: "Security Posture", p0: "MFA + devices", p1: "Tabletop done", p2: "CSF governance" },
  ];

  return (
    <div>
      <h1 className="section-title">KPI Targets and Risk Matrix</h1>
      <p className="section-subtitle">
        What to measure by phase, and the risks that could derail each stage.
      </p>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-phases">
              <span className="kpi-phase-badge" style={{ borderColor: "#E8927C" }}>P0: {k.p0}</span>
              <span className="kpi-phase-badge" style={{ borderColor: "#7EC8E3" }}>P1: {k.p1}</span>
              <span className="kpi-phase-badge" style={{ borderColor: "#A8D5BA" }}>P2: {k.p2}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", marginBottom: "20px" }}>
        Risk Matrix
      </h2>
      <table className="data-table">
        <thead>
          <tr><th>Phase</th><th>Risk</th><th>Mitigation</th></tr>
        </thead>
        <tbody>
          {[
            ["Phase 0", "Client data leaks into self-learning tools", "Tool allowlist, contract review, default redaction, client consent gate"],
            ["Phase 0", "Hallucinated citations in filings", "No-file-without-cite-check gate; AI as drafting assistant only"],
            ["Phase 0", "Trust accounting failure", "Monthly close SOP; 3-way reconciliation discipline"],
            ["Phase 1", "Becoming a drafting farm vs. litigation asset manager", "Weekly EV review; kill low-EV cases early"],
            ["Phase 1", "Trust chaos during first large settlement", "Settlement SOP, lien register, Rule 1.15 holdback"],
            ["Phase 1", "Data breach via devices or misconfigured tools", "MFA, device encryption, remote wipe, breach protocol"],
            ["Phase 2", "Scaling mistakes (bad cases × more staff)", "Enforce underwriting scores; monthly kill-rate targets"],
            ["Phase 2", "Uncontrolled AI use by staff", "Mandatory training + audit trails; managerial duty per ABA 512"],
            ["Phase 2", "Security expectations from bigger counterparties", "CSF governance, SOC vendors, access controls, incident response"],
          ].map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("overview");

  const sectionMap = {
    overview: <OverviewSection />,
    map: <MapSection />,
    phases: <PhasesSection />,
    engine: <EngineSection />,
    finance: <FinanceSection />,
    marketing: <MarketingSection />,
    compliance: <ComplianceSection />,
    kpi: <KPISection />,
  };

  return (
    <>
      <style>{css}</style>
      {/* Note: In React, script tags embedded in JSX generally don't run as expected. 
          You might want to move this into your public/index.html instead. */}
      <script src="https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"></script>
      <div className="app">
        <header className="header">
          <div className="logo-group">
            <div className="logo-monogram">NBNN</div>
            <div className="logo-text">
              <span className="logo">Ngehsi Brendan Ngwa Nforbi, Attorneys at Law</span>
              <span className="logo-sub">Guerrilla Litigation · Maximum Accountability</span>
            </div>
          </div>
          <nav className="nav">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                className={`nav-btn ${activeSection === s.key ? "active" : ""}`}
                onClick={() => setActiveSection(s.key)}
              >
                <span className="nav-icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </header>
        <main className="content" key={activeSection}>
          {sectionMap[activeSection]}
        </main>
      </div>
    </>
  );
}
