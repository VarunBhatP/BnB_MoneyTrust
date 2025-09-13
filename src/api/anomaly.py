from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import sys
import os

# Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import get_ml_models

router = APIRouter()

class TransactionData(BaseModel):
    amount: float
    department_id: int
    vendor_name: str
    transaction_date: str
    description: Optional[str] = None

class BudgetAnalysisRequest(BaseModel):
    transactions: List[TransactionData]
    threshold: Optional[float] = 0.1

class AnomalyResult(BaseModel):
    transaction_index: int
    anomaly_score: float
    is_anomaly: bool
    reasons: List[str]

@router.post("/detect", response_model=List[AnomalyResult])
async def detect_anomalies(request: BudgetAnalysisRequest):
    """Detect anomalies in financial transactions"""
    try:
        models = get_ml_models()
        if "anomaly_detector" not in models:
            raise HTTPException(status_code=503, detail="Anomaly detection model not loaded")
        
        # Convert transactions to DataFrame
        df = pd.DataFrame([t.dict() for t in request.transactions])
        
        # Feature engineering
        features = prepare_features(df)
        
        # Predict anomalies
        anomaly_detector = models["anomaly_detector"]
        anomaly_scores = anomaly_detector.decision_function(features)
        is_anomaly = anomaly_detector.predict(features) == -1
        
        # Prepare results
        results = []
        for i, (score, anomaly) in enumerate(zip(anomaly_scores, is_anomaly)):
            reasons = get_anomaly_reasons(df.iloc[i], score, anomaly)
            results.append(AnomalyResult(
                transaction_index=i,
                anomaly_score=float(score),
                is_anomaly=bool(anomaly),
                reasons=reasons
            ))
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """Prepare features for anomaly detection"""
    features = pd.DataFrame()
    
    # Amount-based features
    features['amount'] = df['amount']
    features['log_amount'] = np.log1p(df['amount'])
    
    # Department frequency
    dept_counts = df['department_id'].value_counts().to_dict()
    features['department_frequency'] = df['department_id'].map(dept_counts)
    
    # Vendor frequency  
    vendor_counts = df['vendor_name'].value_counts().to_dict()
    features['vendor_frequency'] = df['vendor_name'].map(vendor_counts)
    
    # Time-based features (simplified)
    features['hour_of_day'] = np.random.randint(0, 24, len(df))
    
    return features

def get_anomaly_reasons(transaction: pd.Series, score: float, is_anomaly: bool) -> List[str]:
    """Generate reasons for anomaly detection"""
    reasons = []
    
    if is_anomaly:
        if transaction['amount'] > 10000:
            reasons.append("Unusually high transaction amount")
        if score < -0.5:
            reasons.append("Highly unusual transaction pattern")
        reasons.append(f"Anomaly score: {score:.3f}")
    else:
        reasons.append("Transaction appears normal")
    
    return reasons

@router.get("/demo-data")
async def get_demo_data():
    """Get sample data for testing"""
    return {
        "transactions": [
            {
                "amount": 1500.00,
                "department_id": 1,
                "vendor_name": "Office Supplies Inc",
                "transaction_date": "2024-01-15",
                "description": "Monthly office supplies"
            },
            {
                "amount": 75000.00,
                "department_id": 1,
                "vendor_name": "Suspicious Vendor LLC",
                "transaction_date": "2024-01-16", 
                "description": "Equipment purchase"
            },
            {
                "amount": 800.00,
                "department_id": 2,
                "vendor_name": "Regular Vendor Co",
                "transaction_date": "2024-01-17",
                "description": "Regular service"
            }
        ]
    }
