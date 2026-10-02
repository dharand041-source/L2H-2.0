from abc import abstractmethod
from typing import List, Dict, Any, Optional
from app.providers.base import BaseProvider
from app.schemas.domain_schemas import CareerRoleBase

class CareerDataProvider(BaseProvider):
    """Abstract interface for external occupational taxonomies (ESCO, O*NET, BLS)."""

    @abstractmethod
    async def fetch_role_by_code(self, code: str) -> Optional[CareerRoleBase]:
        """Fetch and normalize an occupational profile by external taxonomy code."""
        pass

    @abstractmethod
    async def search_roles(self, query: str, category: Optional[str] = None) -> List[CareerRoleBase]:
        """Search occupational titles and return normalized roles."""
        pass

class ESCOCareerAdapter(CareerDataProvider):
    @property
    def provider_name(self) -> str:
        return "ESCO"

    async def health_check(self) -> bool:
        return True

    async def fetch_role_by_code(self, code: str) -> Optional[CareerRoleBase]:
        # ESCO integration adapter implementation
        return None

    async def search_roles(self, query: str, category: Optional[str] = None) -> List[CareerRoleBase]:
        return []

class ONetCareerAdapter(CareerDataProvider):
    @property
    def provider_name(self) -> str:
        return "ONET"

    async def health_check(self) -> bool:
        return True

    async def fetch_role_by_code(self, code: str) -> Optional[CareerRoleBase]:
        # O*NET Web Services adapter implementation
        return None

    async def search_roles(self, query: str, category: Optional[str] = None) -> List[CareerRoleBase]:
        return []
