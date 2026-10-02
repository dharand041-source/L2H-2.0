from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.schemas.domain_schemas import CareerRoleRead, CareerTrack

router = APIRouter(prefix="/careers", tags=["Careers"])

@router.get("", response_model=List[CareerRoleRead])
async def list_career_roles(
    track: Optional[CareerTrack] = None,
    category_id: Optional[UUID] = None,
    limit: int = Query(default=20, le=100)
):
    """
    List career roles with support for both Technical and Non-Technical career tracks.
    """
    # Sample structured response illustrating domain model adherence
    return [
        CareerRoleRead(
            id=UUID("50000000-0000-0000-0000-000000000001"),
            category_id=UUID("30000000-0000-0000-0000-000000000001"),
            name="Full Stack Developer",
            slug="full-stack-developer",
            description="Builds end-to-end web applications combining dynamic reactive frontends, resilient backend APIs, and performant relational databases.",
            track=CareerTrack.TECHNICAL,
            industry="Information Technology / Software",
            average_salary_usd=105000.0,
            market_demand="VERY_HIGH",
            tasks=[
                "Design RESTful APIs",
                "Build responsive React/Next.js interfaces",
                "Write SQL queries and schemas",
                "Deploy cloud containers"
            ],
            education_requirements=["Bachelor in CS or proven portfolio"],
            source="ESCO",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        CareerRoleRead(
            id=UUID("50000000-0000-0000-0000-000000000003"),
            category_id=UUID("30000000-0000-0000-0000-000000000004"),
            name="Digital Marketing Specialist",
            slug="digital-marketing-specialist",
            description="Develops and executes multi-channel organic and paid growth strategies across SEO, content, email marketing, and social channels.",
            track=CareerTrack.NON_TECHNICAL,
            industry="Digital Agency / E-Commerce",
            average_salary_usd=68000.0,
            market_demand="HIGH",
            tasks=[
                "Execute SEO keyword research",
                "Optimize landing page conversion rates",
                "Manage organic editorial calendars"
            ],
            education_requirements=["Bachelor in Marketing or proven campaign results"],
            source="ESCO",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    ]
