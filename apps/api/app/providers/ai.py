from abc import abstractmethod
from typing import List, Dict, Any, Optional
from uuid import UUID
from app.providers.base import BaseProvider
from app.schemas.domain_schemas import (
    DifficultyLevel,
    QuestionRead,
    EligibilityReport,
    SkillGapRead
)

class AIProvider(BaseProvider):
    """Core intelligence provider interface, decoupled from underlying LLM vendors."""

    @abstractmethod
    async def analyze_skill_gaps(
        self,
        user_skills: List[Dict[str, Any]],
        required_skills: List[Dict[str, Any]]
    ) -> List[SkillGapRead]:
        """Weighted gap analysis between candidate skills and target role requirements."""
        pass

    @abstractmethod
    async def generate_question_variation(
        self,
        skill_name: str,
        difficulty: DifficultyLevel,
        concept: str,
        excluded_prompts: List[str]
    ) -> Optional[Dict[str, Any]]:
        """Generate a validated question variant ensuring non-repetition."""
        pass

    @abstractmethod
    async def evaluate_interview_response(
        self,
        question_text: str,
        candidate_answer: str,
        target_role: str,
        level: DifficultyLevel
    ) -> Dict[str, Any]:
        """Multi-factor interview answer evaluation across correctness, communication, and structure."""
        pass

    @abstractmethod
    async def match_job_eligibility(
        self,
        user_profile: Dict[str, Any],
        job_spec: Dict[str, Any]
    ) -> EligibilityReport:
        """Deterministic requirement verification with explainable match factors."""
        pass

class MockAIAdapter(AIProvider):
    """Deterministic adapter for CI/CD test pipelines and local development without API keys."""
    
    @property
    def provider_name(self) -> str:
        return "MOCK_AI"

    async def health_check(self) -> bool:
        return True

    async def analyze_skill_gaps(
        self,
        user_skills: List[Dict[str, Any]],
        required_skills: List[Dict[str, Any]]
    ) -> List[SkillGapRead]:
        return []

    async def generate_question_variation(
        self,
        skill_name: str,
        difficulty: DifficultyLevel,
        concept: str,
        excluded_prompts: List[str]
    ) -> Optional[Dict[str, Any]]:
        return None

    async def evaluate_interview_response(
        self,
        question_text: str,
        candidate_answer: str,
        target_role: str,
        level: DifficultyLevel
    ) -> Dict[str, Any]:
        return {
            "technical_correctness_score": 85.0,
            "communication_score": 80.0,
            "problem_solving_score": 88.0,
            "structural_clarity_score": 82.0,
            "overall_score": 84.0,
            "strengths": ["Clear explanation of core principles", "Concrete examples given"],
            "areas_for_improvement": ["Could mention trade-offs of chosen approach"],
            "detailed_report": "The candidate demonstrated solid conceptual understanding.",
            "disclaimer": "AI interview evaluation is an educational preparatory tool and does not guarantee employment outcomes."
        }

    async def match_job_eligibility(
        self,
        user_profile: Dict[str, Any],
        job_spec: Dict[str, Any]
    ) -> EligibilityReport:
        return EligibilityReport(
            opportunity_id=UUID("00000000-0000-0000-0000-000000000001"),
            user_id=UUID("00000000-0000-0000-0000-000000000002"),
            status="ELIGIBLE",
            match_score=88.5,
            matched_skills=["JavaScript", "React", "SQL"],
            missing_skills=["Docker"],
            explainable_factors=[
                {
                    "factor": "Skills Compatibility",
                    "verdict": "STRONG",
                    "notes": "Matches 3 out of 4 required core competencies"
                }
            ]
        )
