from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from uuid import UUID

class BaseProvider(ABC):
    """Base class for all decoupled service providers in Learn-2-Hire."""
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of provider adapter."""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Return True if external connection is verified and healthy."""
        pass
