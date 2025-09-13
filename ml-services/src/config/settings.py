import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # API Settings
    API_TITLE: str = "Financial Transparency AI/ML Services"
    API_VERSION: str = "1.0.0"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8001
    
    # ML Model Settings
    ANOMALY_CONTAMINATION: float = 0.1
    ANOMALY_RANDOM_STATE: int = 42
    MODEL_SAVE_PATH: str = "models/"
    
    # Data Settings
    SAMPLE_DATA_PATH: str = "data/sample_budgets.json"
    MAX_TRANSACTIONS_PER_REQUEST: int = 1000
    
    # Voice Processing Settings
    VOICE_CONFIDENCE_THRESHOLD: float = 0.7
    SUPPORTED_LANGUAGES: list = ["en-US", "en-GB"]
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS Settings
    ALLOWED_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()
