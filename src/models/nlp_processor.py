import re
from typing import Dict, List, Tuple
from collections import Counter

class SimpleNLPProcessor:
    """Simple NLP processor for budget queries - Perfect for hackathons"""
    
    def __init__(self):
        # Financial keywords and their categories
        self.keywords = {
            'education': ['education', 'school', 'teacher', 'student', 'learning', 'academic'],
            'healthcare': ['health', 'medical', 'hospital', 'doctor', 'medicine', 'patient'],
            'infrastructure': ['infrastructure', 'road', 'building', 'construction', 'facility'],
            'vendor': ['vendor', 'supplier', 'company', 'contractor', 'business'],
            'spending': ['spend', 'cost', 'expense', 'budget', 'money', 'amount', 'price'],
            'anomaly': ['unusual', 'strange', 'weird', 'suspicious', 'anomaly', 'irregular'],
            'total': ['total', 'sum', 'overall', 'complete', 'entire'],
            'department': ['department', 'division', 'unit', 'section']
        }
        
        # Question patterns
        self.question_patterns = {
            'amount': ['how much', 'what amount', 'cost of', 'spent on', 'budget for'],
            'list': ['list', 'show me', 'what are', 'which', 'top'],
            'comparison': ['compare', 'difference', 'vs', 'versus', 'between'],
            'trend': ['trend', 'increase', 'decrease', 'change', 'growth']
        }

    def extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text - IMPROVED VERSION"""
        text_lower = text.lower()
    
    # Remove punctuation and split into words
        words = re.findall(r'\b\w+\b', text_lower)
    
    # Find matching keywords - CHECK BOTH EXACT WORDS AND SUBSTRINGS
        found_keywords = []
        for category, keywords in self.keywords.items():
            for keyword in keywords:
            # Check if keyword exists as whole word OR as substring
                if keyword in words or keyword in text_lower:
                    found_keywords.append(category)
    
        return list(set(found_keywords))  # Remove duplicates


    def detect_intent(self, text: str) -> str:
        """Detect user intent from query"""
        text_lower = text.lower()
        
        # Check for question patterns
        for intent, patterns in self.question_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    return intent
        
        # Default intent
        return 'information'

    def process_query(self, query: str) -> Dict[str, any]:
        """Process natural language query and extract information"""
        keywords = self.extract_keywords(query)
        intent = self.detect_intent(query)
        
        # Extract numbers (for amounts, years, etc.)
        numbers = re.findall(r'\d+', query)
        
        return {
            'original_query': query,
            'keywords': keywords,
            'intent': intent,
            'numbers': numbers,
            'confidence': self.calculate_confidence(keywords, intent)
        }

    def calculate_confidence(self, keywords: List[str], intent: str) -> float:
        """Calculate confidence score for the query processing"""
        base_confidence = 0.5
        
        # Increase confidence based on number of keywords found
        keyword_boost = min(len(keywords) * 0.1, 0.3)
        
        # Increase confidence if intent is detected
        intent_boost = 0.2 if intent != 'information' else 0
        
        return min(base_confidence + keyword_boost + intent_boost, 1.0)

    def generate_response_template(self, processed_query: Dict[str, any]) -> str:
        """Generate response template based on processed query"""
        keywords = processed_query['keywords']
        intent = processed_query['intent']
        
        # Simple rule-based response generation
        if 'education' in keywords:
            if intent == 'amount':
                return "education_spending"
            elif intent == 'list':
                return "education_breakdown"
        
        elif 'healthcare' in keywords:
            if intent == 'amount':
                return "healthcare_spending"
            elif intent == 'list':
                return "healthcare_breakdown"
        
        elif 'vendor' in keywords:
            if intent == 'list':
                return "vendor_list"
            elif intent == 'amount':
                return "vendor_spending"
        
        elif 'anomaly' in keywords:
            return "anomaly_report"
        
        elif 'total' in keywords and 'budget' in keywords:
            return "total_budget"
        
        return "general_help"

# Example usage functions
def demo_nlp_processing():
    """Demo function to show NLP processing capabilities"""
    processor = SimpleNLPProcessor()
    
    sample_queries = [
        "How much did we spend on education last year?",
        "Show me the top 5 vendors by spending",
        "Are there any unusual transactions in healthcare?",
        "What's our total budget for this year?",
        "List all education department expenses"
    ]
    
    for query in sample_queries:
        result = processor.process_query(query)
        template = processor.generate_response_template(result)
        print(f"Query: {query}")
        print(f"Keywords: {result['keywords']}")
        print(f"Intent: {result['intent']}")
        print(f"Template: {template}")
        print(f"Confidence: {result['confidence']:.2f}")
        print("-" * 50)

if __name__ == "__main__":
    demo_nlp_processing()
