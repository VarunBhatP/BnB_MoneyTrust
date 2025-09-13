import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest
import pickle
import os
from config.settings import settings

class AnomalyDetectionService:
    """Service for handling anomaly detection logic"""
    
    def __init__(self):
        self.model = None
        self.is_trained = False
        
    def train_model(self, training_data: pd.DataFrame) -> bool:
        """Train the anomaly detection model"""
        try:
            self.model = IsolationForest(
                contamination=settings.ANOMALY_CONTAMINATION,
                random_state=settings.ANOMALY_RANDOM_STATE
            )
            self.model.fit(training_data)
            self.is_trained = True
            return True
        except Exception as e:
            print(f"Error training model: {e}")
            return False
    
    def create_default_model(self) -> IsolationForest:
        """Create model with default training data"""
        sample_data = pd.DataFrame({
            'amount': [100, 200, 150, 50000, 300, 250, 180, 90000, 220],
            'department_id': [1, 2, 1, 3, 2, 1, 2, 3, 1],
            'vendor_frequency': [10, 5, 8, 1, 6, 9, 4, 1, 7],
            'time_of_day': [9, 14, 10, 23, 11, 15, 16, 2, 13]
        })
        
        model = IsolationForest(
            contamination=settings.ANOMALY_CONTAMINATION,
            random_state=settings.ANOMALY_RANDOM_STATE
        )
        model.fit(sample_data)
        return model
    
    def detect_anomalies(self, features: pd.DataFrame) -> Dict[str, Any]:
        """Detect anomalies in the given features"""
        if not self.model:
            raise ValueError("Model not trained or loaded")
        
        anomaly_scores = self.model.decision_function(features)
        is_anomaly = self.model.predict(features) == -1
        
        return {
            'scores': anomaly_scores,
            'is_anomaly': is_anomaly,
            'anomaly_count': sum(is_anomaly),
            'total_count': len(features)
        }
    
    def save_model(self, filepath: str) -> bool:
        """Save trained model to file"""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'wb') as f:
                pickle.dump(self.model, f)
            return True
        except Exception as e:
            print(f"Error saving model: {e}")
            return False
    
    def load_model(self, filepath: str) -> bool:
        """Load model from file"""
        try:
            with open(filepath, 'rb') as f:
                self.model = pickle.load(f)
            self.is_trained = True
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

# Global service instance
anomaly_service = AnomalyDetectionService()
