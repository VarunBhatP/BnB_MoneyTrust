import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Dict, Any
import joblib
import os

class AdvancedAnomalyDetector:
    """Advanced anomaly detection with preprocessing and feature engineering"""
    
    def __init__(self, contamination: float = 0.1):
        self.contamination = contamination
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = None
        
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Advanced feature engineering for financial transactions"""
        features = pd.DataFrame()
        
        # Basic amount features
        features['amount'] = df['amount']
        features['log_amount'] = np.log1p(df['amount'])
        features['amount_zscore'] = (df['amount'] - df['amount'].mean()) / df['amount'].std()
        
        # Frequency features
        dept_counts = df['department_id'].value_counts().to_dict()
        features['department_frequency'] = df['department_id'].map(dept_counts)
        
        vendor_counts = df['vendor_name'].value_counts().to_dict()
        features['vendor_frequency'] = df['vendor_name'].map(vendor_counts)
        
        # Time-based features (if date is available)
        if 'transaction_date' in df.columns:
            df['transaction_date'] = pd.to_datetime(df['transaction_date'])
            features['day_of_week'] = df['transaction_date'].dt.dayofweek
            features['hour_of_day'] = df['transaction_date'].dt.hour
        else:
            features['day_of_week'] = np.random.randint(0, 7, len(df))
            features['hour_of_day'] = np.random.randint(0, 24, len(df))
        
        # Statistical features
        features['amount_percentile'] = df['amount'].rank(pct=True)
        
        return features
    
    def fit(self, X: pd.DataFrame) -> 'AdvancedAnomalyDetector':
        """Fit the anomaly detection model"""
        # Engineer features
        features = self.engineer_features(X)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(features)
        
        # Train model
        self.model = IsolationForest(contamination=self.contamination, random_state=42)
        self.model.fit(X_scaled)
        
        # Store feature columns
        self.feature_columns = features.columns.tolist()
        
        return self
    
    def predict(self, X: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Predict anomalies"""
        if self.model is None:
            raise ValueError("Model not fitted yet")
        
        # Engineer features
        features = self.engineer_features(X)
        
        # Ensure same features as training
        for col in self.feature_columns:
            if col not in features.columns:
                features[col] = 0
        features = features[self.feature_columns]
        
        # Scale features
        X_scaled = self.scaler.transform(features)
        
        # Predict
        anomaly_labels = self.model.predict(X_scaled)
        anomaly_scores = self.model.decision_function(X_scaled)
        
        return anomaly_labels, anomaly_scores
    
    def save(self, filepath: str) -> bool:
        """Save model and scaler"""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns,
                'contamination': self.contamination
            }, filepath)
            return True
        except Exception as e:
            print(f"Error saving model: {e}")
            return False
    
    def load(self, filepath: str) -> bool:
        """Load model and scaler"""
        try:
            data = joblib.load(filepath)
            self.model = data['model']
            self.scaler = data['scaler']
            self.feature_columns = data['feature_columns']
            self.contamination = data['contamination']
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
