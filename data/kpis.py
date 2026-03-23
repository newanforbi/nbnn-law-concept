import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import KPIItem, RiskRow

KPI_ITEMS = [
    KPIItem(label="Intake Speed",        p0="Instrumented",  p1="Decreasing",    p2="Stable SLA"),
    KPIItem(label="Qualification Rate",  p0="Baseline set",  p1="Improving",     p2="Predictable"),
    KPIItem(label="Time to Leverage",    p0="Model defined", p1="Consistent",    p2="Short + consistent"),
    KPIItem(label="Filing Quality",      p0="QA checklist",  p1="Zero uncited AI", p2="Peer review"),
    KPIItem(label="Trust Close",         p0="Mock close",    p1="Monthly on time", p2="Audit-ready"),
    KPIItem(label="Security Posture",    p0="MFA + devices", p1="Tabletop done", p2="CSF governance"),
]

RISK_ROWS = [
    RiskRow(phase="Phase 0", risk="Client data leaks into self-learning tools", mitigation="Tool allowlist, contract review, default redaction, client consent gate"),
    RiskRow(phase="Phase 0", risk="Hallucinated citations in filings", mitigation="No-file-without-cite-check gate; AI as drafting assistant only"),
    RiskRow(phase="Phase 0", risk="Trust accounting failure", mitigation="Monthly close SOP; 3-way reconciliation discipline"),
    RiskRow(phase="Phase 1", risk="Becoming a drafting farm vs. litigation asset manager", mitigation="Weekly EV review; kill low-EV cases early"),
    RiskRow(phase="Phase 1", risk="Trust chaos during first large settlement", mitigation="Settlement SOP, lien register, Rule 1.15 holdback"),
    RiskRow(phase="Phase 1", risk="Data breach via devices or misconfigured tools", mitigation="MFA, device encryption, remote wipe, breach protocol"),
    RiskRow(phase="Phase 2", risk="Scaling mistakes (bad cases × more staff)", mitigation="Enforce underwriting scores; monthly kill-rate targets"),
    RiskRow(phase="Phase 2", risk="Uncontrolled AI use by staff", mitigation="Mandatory training + audit trails; managerial duty per ABA 512"),
    RiskRow(phase="Phase 2", risk="Security expectations from bigger counterparties", mitigation="CSF governance, SOC vendors, access controls, incident response"),
]
