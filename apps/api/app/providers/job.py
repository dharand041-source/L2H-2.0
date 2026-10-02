from abc import abstractmethod
from typing import List, Dict, Any, Optional
from app.providers.base import BaseProvider
from app.schemas.domain_schemas import OpportunityRead, OpportunityType

class JobProvider(BaseProvider):
    """Abstract interface for legitimate external job APIs and public feeds."""

    @abstractmethod
    async def fetch_opportunities(
        self,
        keywords: Optional[str] = None,
        location: Optional[str] = None,
        employment_type: Optional[OpportunityType] = None,
        is_remote: Optional[bool] = None,
        limit: int = 25
    ) -> List[Dict[str, Any]]:
        """Fetch real opportunity listings from provider without scraping."""
        pass

    @abstractmethod
    async def verify_listing_freshness(self, external_id: str) -> bool:
        """Check if an opportunity is still live on source platform."""
        pass

class AdzunaJobAdapter(JobProvider):
    def __init__(self, app_id: Optional[str] = None, app_key: Optional[str] = None):
        self.app_id = app_id
        self.app_key = app_key

    @property
    def provider_name(self) -> str:
        return "ADZUNA"

    async def health_check(self) -> bool:
        return bool(self.app_id and self.app_key)

    async def fetch_opportunities(
        self,
        keywords: Optional[str] = None,
        location: Optional[str] = None,
        employment_type: Optional[OpportunityType] = None,
        is_remote: Optional[bool] = None,
        limit: int = 25
    ) -> List[Dict[str, Any]]:
        return []

    async def verify_listing_freshness(self, external_id: str) -> bool:
        return True

class RemotiveJobAdapter(JobProvider):
    @property
    def provider_name(self) -> str:
        return "REMOTIVE"

    async def health_check(self) -> bool:
        return True

    async def fetch_opportunities(
        self,
        keywords: Optional[str] = None,
        location: Optional[str] = None,
        employment_type: Optional[OpportunityType] = None,
        is_remote: Optional[bool] = None,
        limit: int = 25
    ) -> List[Dict[str, Any]]:
        return []

    async def verify_listing_freshness(self, external_id: str) -> bool:
        return True
