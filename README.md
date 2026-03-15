# NBNN Law — Litigation Dashboard

A concept dashboard for a litigation law firm, built with React, Vite, and D3.js.

## Features

- **KPI Cards** — live counts for active cases, total exposure, win rate, and average matter value
- **Revenue Chart** — grouped bar chart comparing monthly billed vs. collected revenue (D3)
- **Case Outcomes Donut** — breakdown of Won / Settled / Active / Lost matters (D3)
- **Matters Table** — filterable by status, searchable by client name or matter ID, with color-coded status badges
- **Dark UI** — bespoke design system with gold accent (`#c9a84c`) matching NBNN Law branding

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI components & state |
| Vite | 6 | Dev server & bundler |
| D3.js | 7 | SVG charts |
| topojson-client | 3 | (reserved for geo features) |

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
│   └── App.jsx         # Dashboard (charts, table, KPIs)
```

## Concepts Explored

- Inline D3 rendering inside React refs (`useEffect` + `useRef`) without third-party chart wrappers
- Single-file design token pattern (constant `C` object) for consistent theming
- Stateful filter + search on a client-side data set
- Responsive grid layout using CSS Grid without a component library
