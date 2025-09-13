from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os

# Global ML models storage
ml_models = {}

def create_anomaly_model():
    """Create basic anomaly detection model"""
    # Sample training data
    sample_data = pd.DataFrame({
        'amount': [100, 200, 150, 50000, 300, 250, 180, 90000, 220],
        'department_id': [1, 2, 1, 3, 2, 1, 2, 3, 1],
        'vendor_frequency': [10, 5, 8, 1, 6, 9, 4, 1, 7],
        'time_of_day': [9, 14, 10, 23, 11, 15, 16, 2, 13]
    })
    
    # Train Isolation Forest model
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(sample_data)
    return model

# Initialize models
ml_models["anomaly_detector"] = create_anomaly_model()
print("✅ Anomaly detection model loaded")

# Create FastAPI app
app = FastAPI(
    title="Financial Transparency AI/ML Services",
    description="AI-powered anomaly detection and voice processing",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Make models accessible to other modules
def get_ml_models():
    return ml_models

# Import and include routers AFTER defining get_ml_models
from api.anomaly import router as anomaly_router
from api.voice import router as voice_router
from api.health import router as health_router

app.include_router(anomaly_router, prefix="/api/anomaly", tags=["Anomaly Detection"])
app.include_router(voice_router, prefix="/api/voice", tags=["Voice Processing"])
app.include_router(health_router, prefix="/api/health", tags=["Health"])

@app.get("/")
async def root():
    return {
        "message": "Financial Transparency AI/ML Services",
        "status": "running",
        "models_loaded": list(ml_models.keys()),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

# Add these imports at the top (keep your existing imports)
from config.settings import settings  # Add this line

# Replace your app creation with this:
app = FastAPI(
    title=settings.API_TITLE,  # Uses config
    description="AI-powered anomaly detection and voice processing",
    version=settings.API_VERSION  # Uses config
)

# Keep everything else the same!
