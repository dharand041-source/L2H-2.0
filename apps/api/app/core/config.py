from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional, List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Learn-2-Hire API"
    VERSION: str = "2.0.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = Field(default="development", env="NODE_ENV")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://learn2hire.vercel.app",
    ]
    
    # Database
    DATABASE_URL: Optional[str] = Field(default=None, env="DATABASE_URL")
    DIRECT_URL: Optional[str] = Field(default=None, env="DIRECT_URL")
    
    # Supabase
    SUPABASE_URL: Optional[str] = Field(default=None, env="NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = Field(default=None, env="SUPABASE_SERVICE_ROLE_KEY")
    
    # Redis
    REDIS_URL: Optional[str] = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # Providers
    AI_PROVIDER_DEFAULT: str = Field(default="gemini", env="AI_PROVIDER_DEFAULT")
    GEMINI_API_KEY: Optional[str] = Field(default=None, env="GEMINI_API_KEY")
    OPENAI_API_KEY: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    
    # External Job Providers
    ADZUNA_APP_ID: Optional[str] = Field(default=None, env="ADZUNA_APP_ID")
    ADZUNA_APP_KEY: Optional[str] = Field(default=None, env="ADZUNA_APP_KEY")
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
