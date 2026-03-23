import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import CompliancePillar, SOP

COMPLIANCE_PILLARS = [
    CompliancePillar(label="ABA 512", title="AI Ethics", checklist=[
        "Competence with AI is ongoing",
        "No client data in unvetted tools",
        "Client disclosure baked into engagement",
        "Written AI policy mandatory",
        "Never file unverified output",
        "Bill actual human time only",
    ]),
    CompliancePillar(label="Rule 1.15 / CTAPP", title="Trust Accounting", checklist=[
        "Funds in labeled trust account",
        "No commingling — ever",
        "Monthly 3-way reconciliation",
        "CTAPP annual reporting",
        "Lien register for disputes",
        "Settlement SOP with holdback",
    ]),
    CompliancePillar(label="CSF 2.0 + CIS", title="Security Program", checklist=[
        "MFA on all accounts centrally",
        "Encrypted email/docs at rest + transit",
        "Password manager (E2E)",
        "Device encryption + remote wipe",
        "Immutable/versioned backups",
        "Breach inquiry + client notification",
    ]),
]

SOPS = [
    SOP(title="Intake → Sign", steps=[
        "Conflict check completed",
        "Disqualification gates cleared",
        "Underwriting score calculated",
        "Client objectives captured",
        "AI disclosure + consent captured",
        "Fee agreement executed",
        "Preservation letter queued",
    ]),
    SOP(title="AI-Assisted Drafting", steps=[
        "Source bundle assembled",
        "AI output labeled in file system",
        "Citations validated in primary DB",
        "Quotes compared to source text",
        "Facts mapped to record cites",
        "Final human rewrite pass",
        "Filing checklist + deadline calendared",
    ]),
    SOP(title="Settlement Disbursement", steps=[
        "Settlement statement + client approval",
        "Lien register updated",
        "Disputed funds held (Rule 1.15)",
        "Disbursement plan reviewed",
        "Trust ledger entries completed",
        "Journal updated; bank records saved",
        "3-way reconciliation archived",
    ]),
]
