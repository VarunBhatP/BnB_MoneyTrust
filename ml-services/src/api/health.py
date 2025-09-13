from fastapi import APIRouter
import time

router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check"""
    # Import here to avoid circular import
    from main import get_ml_models
    
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
    # Import here to avoid circular import
    from main import get_ml_models
    
    models = get_ml_models()
    
    model_status = {}
    for model_name, model in models.items():
        model_status[model_name] = {
            "loaded": model is not None,
            "type": str(type(model)),
            "ready": True
        }
    
    return {"models": model_status}
