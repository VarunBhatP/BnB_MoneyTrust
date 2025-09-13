from fastapi import APIRouter
import time
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import get_ml_models

router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check"""
    models = get_ml_models()
    
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "models_loaded": list(models.keys()),
        "message": "AI/ML services are running"
    }

@router.get("/models")
async def model_status():
    """Check status of loaded ML models"""
    models = get_ml_models()
    
    model_status = {}
    for model_name, model in models.items():
        model_status[model_name] = {
            "loaded": model is not None,
            "type": str(type(model)),
            "ready": True
        }
    
    return {"models": model_status}
