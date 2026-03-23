import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import StaffingRow, SaaSRow, NetworkCircuit

STAFFING_ROWS = [
    StaffingRow(role="Managing Attorney (Founder)", base="$150,000", loaded_annual="$195,000", total_36mo="$585,000"),
    StaffingRow(role="Associate Attorney #1", base="$110,000", loaded_annual="$143,000", total_36mo="$429,000"),
    StaffingRow(role="Associate Attorney #2", base="$110,000", loaded_annual="$143,000", total_36mo="$429,000"),
    StaffingRow(role="Litigation Paralegal (FT)", base="$65,000", loaded_annual="$84,000", total_36mo="$252,000"),
    StaffingRow(role="Intake / Case Manager (FT)", base="$55,000", loaded_annual="$71,000", total_36mo="$213,000"),
    StaffingRow(role="Damages / Recovery Specialist", base="$72,000", loaded_annual="$93,000", total_36mo="$279,000"),
    StaffingRow(role="Trust Bookkeeper (FT)", base="$52,000", loaded_annual="$67,000", total_36mo="$201,000"),
    StaffingRow(role="Contract Investigator", base="$30,000 (contract)", loaded_annual="$30,000", total_36mo="$90,000"),
    StaffingRow(role="TOTAL STAFFING", base="$644,000", loaded_annual="$826,000/yr", total_36mo="$2.55M–$2.65M", is_total=True),
]

SAAS_ROWS = [
    SaaSRow(tool="Clio (8 users, top tier)", annual="$16,000", total_36mo="$48,000"),
    SaaSRow(tool="CoCounsel or Protégé (3 attorneys)", annual="$24,000–$30,000", total_36mo="$72,000–$90,000"),
    SaaSRow(tool="Harvey / Spellbook (2 seats)", annual="$9,000–$12,000", total_36mo="$27,000–$36,000"),
    SaaSRow(tool="API Compute (custom workflows)", annual="$18,000–$24,000", total_36mo="$54,000–$72,000"),
    SaaSRow(tool="Gavel (doc automation)", annual="$5,000", total_36mo="$15,000"),
    SaaSRow(tool="DocuSign (team plan)", annual="$4,000", total_36mo="$12,000"),
    SaaSRow(tool="M365 / Google Workspace (8 users)", annual="$2,500", total_36mo="$7,500"),
    SaaSRow(tool="1Password + Zapier/Make + misc SaaS", annual="$3,000", total_36mo="$9,000"),
    SaaSRow(tool="Cloud backup, MDM, security tooling", annual="$5,000–$6,000", total_36mo="$15,000–$18,000"),
    SaaSRow(tool="TOTAL COMPUTE", annual="$87K–$100K/yr", total_36mo="$260K–$300K", is_total=True),
]

FLAGSHIP_SUMMARY = [
    {"label": "Staffing (loaded)", "value": "$2.55M–$2.65M"},
    {"label": "Compute & AI Tools", "value": "$260K–$300K"},
    {"label": "Office & Overhead", "value": "$120K–$180K"},
    {"label": "Case-Cost Float (recoverable)", "value": "$600K–$800K"},
]

NETWORK_CIRCUITS = [
    NetworkCircuit(tier="Tier 1 — Flagship", description="Stockton, CA (HQ). Full 8-person team, complete infrastructure, your physical base.", nodes=1, cost_per_node="$4.5M–$5.0M / 36 mo", color="#E8927C"),
    NetworkCircuit(tier="Tier 2 — Heavy Nodes", description="NYC, Chicago, Houston, Atlanta/Miami, Washington D.C. Two associates, one paralegal each. Lean on HQ for back-office.", nodes=5, cost_per_node="$1.41M–$1.56M each", color="#7EC8E3"),
    NetworkCircuit(tier="Tier 3 — Light Nodes", description="Boston, Philly/Newark, Alexandria/Baltimore, Detroit, St. Louis, Denver/ABQ, Sacramento. One associate, part-time paralegal.", nodes=7, cost_per_node="$702K–$753K each", color="#A8D5BA"),
]

GRAND_TOTAL_ROWS = [
    ["Stockton Flagship (burn + float)", "$4.50M", "$5.00M"],
    ["5 Tier-2 Heavy Nodes (burn + float)", "$9.05M", "$10.80M"],
    ["7 Tier-3 Light Nodes (burn + float)", "$6.31M", "$8.07M"],
    ["Centralized HQ Functions", "$2.49M", "$3.22M"],
    ["Marketing & Client Acquisition", "$5.00M", "$5.50M"],
    ["Supplemental Costs", "$1.32M", "$2.71M"],
]

CASH_FLOW_ROWS = [
    ["Months 1–6", "~$4.5M", "$0 (pre-settlement)", "–$4.5M"],
    ["Months 7–12", "~$9.0M", "$0–$500K (first settlements)", "–$8.5M to –$9.0M"],
    ["Months 13–18", "~$13.5M", "$1M–$3M (pipeline producing)", "–$10.5M to –$12.5M"],
    ["Months 19–24", "~$18.0M", "$3M–$7M (acceleration)", "–$11M to –$15M"],
    ["Months 25–30", "~$22.5M", "$7M–$14M (mature pipeline)", "–$8.5M to –$15.5M"],
    ["Months 31–36", "~$27.0M", "$12M–$22M (full velocity)", "–$5M to –$15M"],
]

SUPPLEMENTAL_ROWS = [
    ["Bar Admissions & Pro Hac Vice", "State bar apps ($500–$2,500 each), pro hac vice motions ($250–$500/case/jurisdiction) across 13 states", "$80K–$150K"],
    ["Expert Witness Retainers", "Use-of-force, medical, economics, immigration policy experts at $15K–$50K per engagement. ~20% of active cases.", "$200K–$500K"],
    ["CLE & AI Competency Training", "Mandatory per ABA 512 and CA Rule 1.1. $2K–$4K per attorney/year × 28 attorneys.", "$168K–$336K"],
    ["Translation & Interpreter Services", "Certified human interpreters for depositions, hearings, consultations beyond AI coverage. Dozens of languages for asylum cases.", "$108K–$216K"],
    ["E-Discovery & Doc Hosting", "Relativity/Everlaw hosting for document-heavy cases against institutional defendants. Body camera footage alone can be terabytes.", "$100K–$250K"],
    ["Travel", "Court appearances, depositions, client meetings, inter-node travel across 13 cities. $3K–$5K/month network-wide.", "$108K–$180K"],
    ["Recruiting", "Legal recruiters at 15–25% of first-year salary for ~13 associate placements + support staff across 13 markets.", "$250K–$450K"],
    ["Tax, Accounting & Corporate Legal", "Multi-state PLLC tax filings, franchise taxes, registered agents, outside corporate counsel. $60K–$100K/year.", "$180K–$300K"],
    ["Custom Tech Development", "Proprietary intake portals, internal dashboards, case scoring algorithms. Initial build + maintenance.", "$122K–$330K"],
]

HQ_ROWS = [
    ["Founder Draw (loaded)", "$585,000"],
    ["Finance & Trust Team (controller + 2 staff)", "$520,000"],
    ["Centralized Intake & Ops Manager", "$250,000"],
    ["National Marketing & SEO", "$540K–$1.08M"],
    ["Centralized AI & Compute Stack (~40 users)", "$350K–$420K"],
    ["National Malpractice Umbrella & E&O", "$240K–$360K"],
]

NODE_COST_ROWS = [
    ["Associates (loaded)", "$286K (2 attorneys)", "$143K (1 attorney)"],
    ["Paralegal (loaded)", "$84K (1 FT)", "$42K (0.5 FT)"],
    ["Office Lease", "$60K–$96K/yr", "$24K–$36K/yr"],
    ["Malpractice & Insurance", "$25K–$35K/yr", "$15K–$20K/yr"],
    ["Local Overhead & Supplies", "$15K–$20K/yr", "$10K/yr"],
    ["Annual Per-Node Cost", "$470K–$520K", "$234K–$251K"],
    ["36-Month Per-Node Burn", "$1.41M–$1.56M", "$702K–$753K"],
    ["Case-Cost Float (per node)", "$400K–$600K", "$200K–$400K"],
]
