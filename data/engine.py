import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import EngineLayer, ABAControl, TechStackRow

ENGINE_LAYERS = [
    EngineLayer(badge="LAYER 1", title="Input — Intake and Fact Capture",
        text="Automated intake funnels with practice-specific AI dialogue. Extracts key facts, generates viability scores via proprietary rubric, presents structured summaries to human attorneys for final acceptance."),
    EngineLayer(badge="LAYER 2", title="Processing — AI Workflow and Discovery",
        text="Centralized case management with agentic extraction from evidence. Research agents monitor dockets, calculate deadlines, perform multi-jurisdictional research. All outputs cross-referenced against validation systems."),
    EngineLayer(badge="LAYER 3", title="Output — Court-Ready Production",
        text="Drafting agents construct rule-compliant pleadings, demands, and discovery responses adapted to jurisdiction-specific requirements. Single operator produces output traditionally requiring 5 associates and 3 paralegals."),
]

ABA_CONTROLS = [
    ABAControl(num="01", title="Tool Allowlist", desc="Green (public), Yellow (de-identified client data), Red (privileged/PII — vetted tools only)."),
    ABAControl(num="02", title="Mandatory Verification", desc="No filing without cite verification, quote verification, and record cross-check."),
    ABAControl(num="03", title="Work-Product Labeling", desc="All AI-assisted drafts labeled in DMS so future users understand fallibility."),
    ABAControl(num="04", title="Client Consent Gate", desc="Informed consent for inputting representation information into GAI tools."),
    ABAControl(num="05", title="Billing Integrity", desc="Bill actual human time only. 15 min prompting = 15 min billed."),
    ABAControl(num="06", title="Supervision", desc="Nonlawyers using AI must be trained and supervised. Managerial policies mandatory."),
]

TECH_STACK = [
    TechStackRow(category="Practice Management", tool="Clio", role="System of record — billing, calendaring, SOC-reported security"),
    TechStackRow(category="Trust Payments", tool="LawPay", role="IOLTA-safe processing — fees never debited from trust"),
    TechStackRow(category="Legal AI Research", tool="CoCounsel / Protégé", role="Deep research with citation validation"),
    TechStackRow(category="Draft Augmentation", tool="Harvey / Spellbook", role="Jurisdiction-adaptive drafting (strict vetting required)"),
    TechStackRow(category="Doc Automation", tool="Gavel", role="Intake-to-document pipeline"),
    TechStackRow(category="E-Signature", tool="DocuSign", role="Trust center and security-published"),
    TechStackRow(category="Integration", tool="Zapier / Make", role="Workflow orchestration (SOC 2 compliant)"),
    TechStackRow(category="Platform", tool="M365 / Google Workspace", role="MFA enforced, encryption at rest + in transit"),
    TechStackRow(category="Passwords", tool="1Password", role="E2E encrypted credential management"),
]
