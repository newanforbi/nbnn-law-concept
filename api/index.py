import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Resolve paths relative to this file so it works both locally and on Vercel
BASE_DIR = Path(__file__).resolve().parent.parent

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "templates")
templates.env.globals["enumerate"] = enumerate


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    # Import data lazily so Vercel cold-starts stay fast
    from data.circuits import CIRCUITS, NODES, STATE_FIPS
    from data.phases import PHASE_DATA
    from data.engine import ENGINE_LAYERS, ABA_CONTROLS, TECH_STACK
    from data.financials import (STAFFING_ROWS, SAAS_ROWS, FLAGSHIP_SUMMARY, NETWORK_CIRCUITS,
                                  GRAND_TOTAL_ROWS, CASH_FLOW_ROWS, SUPPLEMENTAL_ROWS, HQ_ROWS, NODE_COST_ROWS)
    from data.marketing import (DIGITAL_CHANNELS, COMMUNITY_ITEMS, BRAND_ITEMS, BUDGET_SUMMARY,
                                  COMMUNITY_TABLE, BRAND_TABLE, SPEND_PHASING)
    from data.compliance import COMPLIANCE_PILLARS, SOPS
    from data.kpis import KPI_ITEMS, RISK_ROWS

    return templates.TemplateResponse(
        "base.html",
        {
            "request": request,
            "circuits": [c.model_dump() for c in CIRCUITS],
            "nodes": [n.model_dump() for n in NODES],
            "state_fips": STATE_FIPS,
            "phases": [p.model_dump() for p in PHASE_DATA],
            "engine_layers": [l.model_dump() for l in ENGINE_LAYERS],
            "aba_controls": [c.model_dump() for c in ABA_CONTROLS],
            "tech_stack": [t.model_dump() for t in TECH_STACK],
            "staffing_rows": [r.model_dump() for r in STAFFING_ROWS],
            "saas_rows": [r.model_dump() for r in SAAS_ROWS],
            "flagship_summary": FLAGSHIP_SUMMARY,
            "network_circuits": [n.model_dump() for n in NETWORK_CIRCUITS],
            "grand_total_rows": GRAND_TOTAL_ROWS,
            "cash_flow_rows": CASH_FLOW_ROWS,
            "supplemental_rows": SUPPLEMENTAL_ROWS,
            "hq_rows": HQ_ROWS,
            "node_cost_rows": NODE_COST_ROWS,
            "digital_channels": [d.model_dump() for d in DIGITAL_CHANNELS],
            "community_items": [c.model_dump() for c in COMMUNITY_ITEMS],
            "brand_items": [b.model_dump() for b in BRAND_ITEMS],
            "budget_summary": BUDGET_SUMMARY,
            "community_table": COMMUNITY_TABLE,
            "brand_table": BRAND_TABLE,
            "spend_phasing": SPEND_PHASING,
            "compliance_pillars": [p.model_dump() for p in COMPLIANCE_PILLARS],
            "sops": [s.model_dump() for s in SOPS],
            "kpi_items": [k.model_dump() for k in KPI_ITEMS],
            "risk_rows": [r.model_dump() for r in RISK_ROWS],
        },
    )
