import pytest
from uuid import UUID
from datetime import datetime
from app.schemas.domain_schemas import (
    CareerRoleRead,
    CareerTrack,
    DifficultyLevel,
    QuestionRead,
    QuestionType,
    EligibilityReport
)
from app.providers.ai import MockAIAdapter
from app.providers.job import RemotiveJobAdapter

def test_career_schema_validation():
    role = CareerRoleRead(
        id=UUID("50000000-0000-0000-0000-000000000001"),
        category_id=UUID("30000000-0000-0000-0000-000000000001"),
        name="Full Stack Developer",
        slug="full-stack-developer",
        description="Comprehensive web application engineer.",
        track=CareerTrack.TECHNICAL,
        industry="Technology",
        average_salary_usd=105000.0,
        market_demand="VERY_HIGH",
        tasks=["API design", "React UI"],
        education_requirements=["CS Degree"],
        source="ESCO",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    assert role.name == "Full Stack Developer"
    assert role.track == CareerTrack.TECHNICAL

def test_mock_ai_adapter():
    ai = MockAIAdapter()
    assert ai.provider_name == "MOCK_AI"

def test_job_adapter():
    job_provider = RemotiveJobAdapter()
    assert job_provider.provider_name == "REMOTIVE"
