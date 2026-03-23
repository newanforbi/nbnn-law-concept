from pydantic import BaseModel
from typing import Optional


class Circuit(BaseModel):
    id: str
    color: str
    states: list[str]


class Node(BaseModel):
    city: str
    circuit: str
    lat: float
    lng: float
    rationale: str


class BudgetRange(BaseModel):
    low: str
    mid: str
    high: str


class Phase(BaseModel):
    phase: str
    subtitle: str
    timeline: str
    color: str
    objectives: list[str]
    deliverables: list[str]
    budget: BudgetRange
    team: str
    trigger: str


class EngineLayer(BaseModel):
    badge: str
    title: str
    text: str


class ABAControl(BaseModel):
    num: str
    title: str
    desc: str


class TechStackRow(BaseModel):
    category: str
    tool: str
    role: str


class StaffingRow(BaseModel):
    role: str
    base: str
    loaded_annual: str
    total_36mo: str
    is_total: bool = False


class SaaSRow(BaseModel):
    tool: str
    annual: str
    total_36mo: str
    is_total: bool = False


class NetworkCircuit(BaseModel):
    tier: str
    description: str
    nodes: int
    cost_per_node: str
    color: str


class DigitalChannel(BaseModel):
    channel: str
    monthly: str
    total_36mo: str
    is_total: bool = False


class CommunityItem(BaseModel):
    label: str
    bullet_items: list[str]
    accent: str


class BrandItem(BaseModel):
    label: str
    desc: str
    cost: str


class CompliancePillar(BaseModel):
    label: str
    title: str
    checklist: list[str]


class SOP(BaseModel):
    title: str
    steps: list[str]


class KPIItem(BaseModel):
    label: str
    p0: str
    p1: str
    p2: str


class RiskRow(BaseModel):
    phase: str
    risk: str
    mitigation: str
