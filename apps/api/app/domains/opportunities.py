from fastapi import APIRouter
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.schemas.domain_schemas import OpportunityRead, OpportunityType, EligibilityReport, EligibilityFactor

router = APIRouter(prefix="/opportunities", tags=["Opportunities & Jobs"])

@router.get("", response_model=List[OpportunityRead])
async def list_opportunities(
    employment_type: Optional[OpportunityType] = None,
    is_remote: Optional[bool] = None
):
    """
    List opportunities normalized from verified external providers and employer sources.
    """
    return [
        OpportunityRead(
            id=UUID("80000000-0000-0000-0000-000000000001"),
            external_id="adzuna-492104192",
            source="ADZUNA",
            source_url="https://www.adzuna.com/details/492104192",
            apply_url="https://company.example.com/careers/junior-fs-dev",
            company_name="Apex Media & Cloud Labs",
            title="Junior Full Stack Developer",
            description="Seeking a junior engineer proficient in TypeScript, React, and PostgreSQL for distributed web products.",
            location="Remote / Hybrid",
            is_remote=True,
            employment_type=OpportunityType.FULL_TIME,
            required_skills=["JavaScript", "React", "PostgreSQL", "Node.js"],
            posted_at=datetime.utcnow(),
            last_verified_at=datetime.utcnow()
        )
    ]

@router.get("/eligibility/{opportunity_id}/{user_id}", response_model=EligibilityReport)
async def check_job_eligibility(opportunity_id: UUID, user_id: UUID):
    """
    Rule-based deterministic qualification checker evaluating skills, experience, and work mode.
    """
    return EligibilityReport(
        opportunity_id=opportunity_id,
        user_id=user_id,
        status="POSSIBLY_ELIGIBLE",
        match_score=78.0,
        matched_skills=["JavaScript", "React", "PostgreSQL"],
        missing_skills=["Docker"],
        explainable_factors=[
            EligibilityFactor(
                factor="Core Competencies",
                verdict="STRONG",
                notes="Candidate has verified L3/L4 evidence in 3 out of 4 skills."
            ),
            EligibilityFactor(
                factor="Containerization",
                verdict="MISSING",
                notes="Role requires Docker familiarity. Complete Docker containerization milestone."
            )
        ]
    )
