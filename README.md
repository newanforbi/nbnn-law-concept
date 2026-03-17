# Ngehsi Brendan Ngwa Nforbi, Attorneys at Law

**Guerrilla Litigation · Maximum Accountability**

**Live:** https://newanforbi.github.io/nbnn-law-concept/

A concept dashboard for an AI-native, multi-track plaintiff litigation firm built to collapse the cost of legal production while capturing underserved markets in civil rights, state torts, and immigration law.

## Sections

| Section | Description |
|---|---|
| **Overview** | Firm thesis, practice areas, and target markets |
| **Circuit Map** | Interactive D3 map of all 12 federal circuits with strategic node rationale |
| **Phases** | Growth roadmap from Phase Zero (foundation) through national expansion |
| **AI Engine** | AI usage policy, tool governance, and verification workflows |
| **Financials** | Revenue projections, cost model, and unit economics by phase |
| **Marketing** | Acquisition channels, referral networks, and brand strategy |
| **Compliance** | Trust accounting, security baseline, and ethics controls |
| **KPIs** | Performance metrics and risk matrix across all phases |

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI components & state |
| Vite | 6 | Dev server & bundler |
| D3.js | 7 | Interactive circuit map |
| TopoJSON | 3 | US state geodata |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
nbnn-law-concept/
├── index.html          # HTML entry point
├── vite.config.js      # Vite + React plugin config
├── package.json
├── src/
│   ├── main.jsx        # React root mount
│   └── App.jsx         # All sections, styles, and D3 chart logic
```
