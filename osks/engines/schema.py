"""
OSKS Core Engine: Schema Definitions (Pydantic v2 Compliant)
File: engines/schema.py
"""

from datetime import date
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl


class LifecycleStatus(str, Enum):
    RESEARCH = "Research"
    VERIFICATION = "Verification"
    AUTHORING = "Authoring"
    TECHNICAL_REVIEW = "Technical_Review"
    PUBLISHED = "Published"
    DEPRECATED = "Deprecated"


class StabilityClass(str, Enum):
    STATIC = "static"
    TIME_SENSITIVE = "time_sensitive"


class AuthorityTier(str, Enum):
    PRIMARY = "Primary"
    SECONDARY = "Secondary"
    SUPPORTING = "Supporting"


class EvidenceSource(BaseModel):
    id: str = Field(..., description="e.g., RFC-793, NIST-SP-800-53")
    type: str = Field(..., description="RFC, NIST, Vendor, Academic")
    authority: AuthorityTier
    uri: Optional[HttpUrl] = None
    control: Optional[str] = None


class EvidenceVerification(BaseModel):
    status: str = Field(default="pending")
    reviewed_by: Optional[str] = None
    last_verified: Optional[date] = None


class EvidenceModel(BaseModel):
    sources: List[EvidenceSource] = Field(..., min_length=1)
    verification: EvidenceVerification = Field(default_factory=EvidenceVerification)


class Taxonomy(BaseModel):
    domain: str
    discipline: str
    technology: str
    skill_level: str = Field(default="intermediate")


class TargetEnvironment(BaseModel):
    protocols: List[str] = Field(default_factory=list)
    os_platforms: List[str] = Field(default_factory=list)


class KnowledgeGraph(BaseModel):
    prerequisites: List[str] = Field(default_factory=list)
    next_topics: List[str] = Field(default_factory=list)
    lab_references: List[str] = Field(default_factory=list)
    glossary_terms: List[str] = Field(default_factory=list)
    mitre_attack: List[str] = Field(default_factory=list)


class Provenance(BaseModel):
    generated_by_agent: str
    llm_profile: str
    prompt_version: str
    compatible_arch_version: str = "1.0.0"
    source_artifacts: List[str] = Field(default_factory=list)
    generation_timestamp: str


class ChangelogEntry(BaseModel):
    version: str
    date: date
    reason: str
    author: str


class ModuleMetadata(BaseModel):
    id: str = Field(..., pattern=r"^[A-Z]{3,4}-\d{3}$")
    title: str
    volume: str
    chapter: str
    version: str = "1.0.0"
    stability: StabilityClass
    status: LifecycleStatus = LifecycleStatus.RESEARCH
    taxonomy: Taxonomy
    target_environment: Optional[TargetEnvironment] = None
    learning_outcomes: List[str] = Field(..., min_length=1)
    evidence: EvidenceModel
    knowledge_graph: KnowledgeGraph
    provenance: Optional[Provenance] = None
    changelog: List[ChangelogEntry] = Field(default_factory=list)
