import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import Phase, BudgetRange

PHASE_DATA = [
    Phase(
        phase="Phase Zero", subtitle="Foundation", timeline="4–8 weeks",
        color="#E8927C",
        objectives=[
            "Convert vision into a bounded practice thesis",
            "Build case underwriting model and repeatable production pipeline",
            "Implement compliance control plane: AI policy, trust readiness, security baseline",
        ],
        deliverables=[
            "Matter selection rubric with disqualification gates",
            "Damages model workbook by claim families",
            "Multi-track decision map for California deadlines",
            "AI usage policy and SOP with tool allowlist/denylist",
            "Trust accounting readiness kit (Rule 1.15)",
            "Security baseline mapped to NIST CSF 2.0",
            "Template set (fee agreement, complaints, discovery shells)",
        ],
        budget=BudgetRange(low="$2K–$8K", mid="$8K–$25K", high="$25K–$75K"),
        team="Founder only + optional fractional bookkeeper",
        trigger="Complete simulated matter with logged verification and no-unsafe-disclosure workflow",
    ),
    Phase(
        phase="Phase One", subtitle="Solo Operator", timeline="6–12 months",
        color="#7EC8E3",
        objectives=[
            "Validate case selection rubric predicts outcomes",
            "Build production cadence: intake → filing → discovery → settlement",
            "Build compounding assets: pleading libraries, damages models, expert lists",
            "Maintain trust/security/AI compliance as volume grows",
        ],
        deliverables=[
            "100-point underwriting scoring system operational",
            "Disqualification gates with hard-no criteria",
            "Weekly expected-value case reviews",
            "Settlement disbursement SOP with lien register",
            "AI six-control framework enforced",
        ],
        budget=BudgetRange(low="$1.5K–$4K/mo", mid="$4K–$10K/mo", high="$10K–$25K/mo"),
        team="Founder → intake assistant → contract paralegal → bookkeeper",
        trigger="Stable throughput, measurable unit economics, zero unverified citations",
    ),
    Phase(
        phase="Phase Two", subtitle="Boutique Build-Out", timeline="12–24 months",
        color="#A8D5BA",
        objectives=[
            "Specialize into 1–3 claim families with informational advantage",
            "Hire into staffing lanes, not general helpers",
            "Make quality measurable: error rates, deadline performance, settlement velocity",
            "Upgrade security and governance for bigger defendants",
        ],
        deliverables=[
            "Full staffing lanes: paralegal, intake, associate, damages, ops",
            "Multi-track playbook mature and repeatable",
            "Audit-ready trust and security governance",
            "Peer review + QA loops functioning without founder",
        ],
        budget=BudgetRange(low="$15K–$35K/mo", mid="$35K–$80K/mo", high="$80K–$160K/mo"),
        team="Founder + paralegal → intake specialist → associate → damages → ops",
        trigger="Can add headcount without degrading outcomes; AI controls followed by non-founders",
    ),
    Phase(
        phase="Phase Three+", subtitle="National Expansion", timeline="24+ months",
        color="#C3A6D8",
        objectives=[
            "Deploy circuit-node model across all 13 federal circuits",
            "Scale through federal court uniformity and local counsel networks",
            "Penetrate local state courts via AI + local counsel dual approach",
            "Establish the firm as preeminent AI-powered litigation force",
        ],
        deliverables=[
            "13 circuit anchor nodes operational",
            "Salaried attorney network with performance bonuses",
            "Centralized AI engine serving all nodes",
            "National brand dominance in target practice areas",
        ],
        budget=BudgetRange(low="Varies", mid="by circuit", high="deployment"),
        team="CEO/Systems Architect + salaried litigators ($100K–$130K base)",
        trigger="Per-circuit ROI positive within 18 months of node deployment",
    ),
]
