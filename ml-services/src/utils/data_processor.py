import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import json
from pathlib import Path

class DataProcessor:
    """Utility class for data processing and validation"""
    
    @staticmethod
    def validate_transaction_data(data: Dict[str, Any]) -> bool:
        """Validate transaction data structure"""
        required_fields = ['amount', 'department_id', 'vendor_name', 'transaction_date']
        
        for field in required_fields:
            if field not in data:
                return False
        
        # Validate data types
        if not isinstance(data['amount'], (int, float)) or data['amount'] <= 0:
            return False
        
        if not isinstance(data['department_id'], int) or data['department_id'] <= 0:
            return False
        
        return True
    
    @staticmethod
    def clean_transaction_data(transactions: List[Dict[str, Any]]) -> pd.DataFrame:
        """Clean and normalize transaction data"""
        df = pd.DataFrame(transactions)
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        df = df.dropna(subset=['amount', 'department_id', 'vendor_name'])
        
        # Normalize vendor names
        df['vendor_name'] = df['vendor_name'].str.strip().str.title()
        
        # Ensure positive amounts
        df = df[df['amount'] > 0]
        
        return df
    
    @staticmethod
    def load_sample_data(filepath: str) -> Dict[str, Any]:
        """Load sample data from JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return DataProcessor.get_default_sample_data()
        except Exception as e:
            print(f"Error loading sample data: {e}")
            return DataProcessor.get_default_sample_data()
    
    @staticmethod
    def get_default_sample_data() -> Dict[str, Any]:
        """Get default sample data if file is not available"""
        return {
            "institution": "Default University",
            "fiscal_year": 2024,
            "total_budget": 14800000,
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
    
    @staticmethod
    def calculate_statistics(df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate basic statistics for transactions"""
        return {
            'total_transactions': len(df),
            'total_amount': df['amount'].sum(),
            'average_amount': df['amount'].mean(),
            'median_amount': df['amount'].median(),
            'max_amount': df['amount'].max(),
            'min_amount': df['amount'].min(),
            'unique_vendors': df['vendor_name'].nunique(),
            'unique_departments': df['department_id'].nunique()
        }

class ResponseFormatter:
    """Utility class for formatting API responses"""
    
    @staticmethod
    def format_anomaly_response(
        transaction_data: pd.DataFrame,
        anomaly_scores: np.ndarray,
        is_anomaly: np.ndarray
    ) -> List[Dict[str, Any]]:
        """Format anomaly detection results"""
        results = []
        
        for i, (score, anomaly) in enumerate(zip(anomaly_scores, is_anomaly)):
            transaction = transaction_data.iloc[i]
            
            reasons = []
            if anomaly:
                if transaction['amount'] > 10000:
                    reasons.append("Unusually high transaction amount")
                if score < -0.5:
                    reasons.append("Highly unusual transaction pattern")
                reasons.append(f"Anomaly score: {score:.3f}")
            else:
                reasons.append("Transaction appears normal")
            
            results.append({
                'transaction_index': i,
                'anomaly_score': float(score),
                'is_anomaly': bool(anomaly),
                'reasons': reasons,
                'transaction_amount': float(transaction['amount']),
                'vendor_name': transaction['vendor_name']
            })
        
        return results
