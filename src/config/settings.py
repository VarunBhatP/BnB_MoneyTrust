import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings with environment variables"""
    
    # API Settings
    API_TITLE = os.getenv("API_TITLE", "Financial Transparency AI/ML Services")
    API_VERSION = os.getenv("API_VERSION", "1.0.0")
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8001))
    
    # ML Model Settings
    ANOMALY_CONTAMINATION = float(os.getenv("ANOMALY_CONTAMINATION", 0.1))
    ANOMALY_RANDOM_STATE = int(os.getenv("ANOMALY_RANDOM_STATE", 42))
    
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS Settings
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

settings = Settings()
