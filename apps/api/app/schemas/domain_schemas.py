from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import List, Optional, Dict, Any, Union
from enum import Enum
from datetime import datetime
from uuid import UUID

class CandidateEntryLevel(str, Enum):
    BEGINNER = "BEGINNER"
    AMATEUR = "AMATEUR"
    PROFESSIONAL = "PROFESSIONAL"

class DifficultyLevel(str, Enum):
    L0 = "L0"
    L1 = "L1"
    L2 = "L2"
    L3 = "L3"
    L4 = "L4"
    L5 = "L5"

class CareerTrack(str, Enum):
    TECHNICAL = "TECHNICAL"
    NON_TECHNICAL = "NON_TECHNICAL"
    HYBRID = "HYBRID"

class QuestionType(str, Enum):
    MCQ = "MCQ"
    MULTI_SELECT = "MULTI_SELECT"
    CODING = "CODING"
    SQL = "SQL"
    DEBUGGING = "DEBUGGING"
    SCENARIO = "SCENARIO"
    CASE_STUDY = "CASE_STUDY"
    SHORT_ANSWER = "SHORT_ANSWER"

class OpportunityType(str, Enum):
    FULL_TIME = "FULL_TIME"
    INTERNSHIP = "INTERNSHIP"
    APPRENTICESHIP = "APPRENTICESHIP"
    GRADUATE_TRAINEE = "GRADUATE_TRAINEE"
    STARTUP = "STARTUP"
    REMOTE = "REMOTE"
    PART_TIME = "PART_TIME"
    CONTRACT = "CONTRACT"

# --- Career Schemas ---
class CareerRoleBase(BaseModel):
    name: str
    slug: str
    description: str
    track: CareerTrack
    industry: str
    average_salary_usd: Optional[float] = None
    market_demand: str = "HIGH"
    tasks: List[str]
    education_requirements: List[str] = []

class CareerRoleRead(CareerRoleBase):
    id: UUID
    category_id: UUID
    source: str
    created_at: datetime
    updated_at: datetime

# --- Skill & Analysis Schemas ---
class SkillGapRead(BaseModel):
    skill_id: UUID
    skill_name: str
    required_level: DifficultyLevel
    current_level: DifficultyLevel
    gap_steps: int
    priority: str
    recommended_action: str

class ReadinessAnalysisRead(BaseModel):
    user_id: UUID
    target_role_id: UUID
    target_role_name: str
    overall_readiness_score: float
    total_required_skills: int
    satisfied_skills_count: int
    gaps: List[SkillGapRead]
    generated_at: datetime

# --- Assessment Schemas ---
class QuestionRead(BaseModel):
    id: UUID
    skill_id: UUID
    topic: str
    difficulty: DifficultyLevel
    question_type: QuestionType
    prompt: str
    options: Optional[List[str]] = None
    concept_tested: str
    source_type: str
    quality_score: float

class AssessmentAnswerSubmission(BaseModel):
    question_id: UUID
    user_answer: Union[str, List[str]]
    time_spent_seconds: int

class AssessmentSubmission(BaseModel):
    attempt_id: UUID
    answers: List[AssessmentAnswerSubmission]

# --- Opportunity & Eligibility Schemas ---
class OpportunityRead(BaseModel):
    id: UUID
    external_id: str
    source: str
    source_url: str
    apply_url: str
    company_name: str
    company_logo_url: Optional[str] = None
    title: str
    description: str
    location: str
    is_remote: bool
    employment_type: OpportunityType
    required_skills: List[str]
    posted_at: datetime
    last_verified_at: datetime

class EligibilityFactor(BaseModel):
    factor: str
    verdict: str # STRONG, PARTIAL, MISSING, NOT_APPLICABLE
    notes: str

class EligibilityReport(BaseModel):
    opportunity_id: UUID
    user_id: UUID
    status: str # ELIGIBLE, POSSIBLY_ELIGIBLE, REQUIREMENTS_MISSING, REQUIREMENTS_UNKNOWN
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    explainable_factors: List[EligibilityFactor]
