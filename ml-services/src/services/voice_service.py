import random
from typing import Dict, List
from config.settings import settings
from models.nlp_processor import SimpleNLPProcessor

class VoiceProcessingService:
    """Enhanced service for handling voice and natural language processing"""
    
    def __init__(self):
        self.nlp_processor = SimpleNLPProcessor()
        self.budget_responses = {
            'education': "Education department received $5.2M this year (35% of total budget). Breakdown: Teacher salaries $3.2M, Equipment $1.5M, Facilities $500K.",
            'healthcare': "Healthcare budget is $3.1M (21% of total). Breakdown: Medical staff $2M, Equipment $800K, Medicine supplies $300K.",
            'infrastructure': "Infrastructure budget is $2.1M (14% of total). Projects: Road maintenance $800K, Building repairs $700K, New construction $600K.",
            'vendor': "Top vendors by spending: 1) TechCorp Ltd ($800K), 2) EduSupply Inc ($700K), 3) Medical Supplies Co ($600K), 4) Construction Plus ($450K), 5) Office Mart ($300K).",
            'anomaly': "Found 3 unusual transactions this month: $75K payment to new vendor, $45K after-hours transaction, and duplicate $12K payments. All flagged for review.",
            'total': "Total institutional budget is $14.8M for fiscal year 2024. Allocation: Education (35%), Healthcare (21%), Infrastructure (14%), Administration (12%), Research (10%), Other (8%).",
            'comparison': "Education ($5.2M) leads spending, followed by Healthcare ($3.1M) and Infrastructure ($2.1M). Education increased by 8% from last year.",
            'department': "Active departments: Education (ID:1), Healthcare (ID:2), Infrastructure (ID:3), Administration (ID:4), Research (ID:5). Each has dedicated budget allocation.",
            'default': "I can help you with budget information. Try asking about education spending, healthcare budget, top vendors, unusual transactions, or total budget allocation."
        }
    
    def process_text_query(self, query: str) -> Dict[str, any]:
        """Enhanced processing with NLP analysis"""
        try:
            # Use NLP to analyze the query
            nlp_result = self.nlp_processor.process_query(query)
            
            # Smart response selection based on NLP analysis
            response = self._select_smart_response(nlp_result)
            
            return {
                'query': query,
                'answer': response,
                'confidence': nlp_result['confidence'],
                'keywords_detected': nlp_result['keywords'],
                'intent': nlp_result['intent'],
                'numbers_found': nlp_result['numbers'],
                'processing_time': 0.1,
                'nlp_template': self.nlp_processor.generate_response_template(nlp_result)
            }
            
        except Exception as e:
            return {
                'query': query,
                'answer': f"Sorry, I encountered an error processing your query: {str(e)}",
                'confidence': 0.0,
                'keywords_detected': [],
                'intent': 'error',
                'processing_time': 0.1
            }
    
    def _select_smart_response(self, nlp_result: Dict) -> str:
        """Select response based on NLP analysis with priority logic"""
        keywords = nlp_result['keywords']
        intent = nlp_result['intent']
        
        # Handle multiple keywords with priority
        if 'education' in keywords:
            if 'vendor' in keywords:
                return "Education vendors: EduSupply Inc ($700K), Academic Tech ($400K), Learning Resources ($200K). All payments verified and within normal ranges."
            return self.budget_responses['education']
            
        elif 'healthcare' in keywords:
            if 'vendor' in keywords:
                return "Healthcare vendors: Medical Supplies Co ($600K), PharmaCorp ($300K), Equipment Rental ($200K). Recent audit shows all compliant."
            return self.budget_responses['healthcare']
            
        elif 'infrastructure' in keywords:
            if 'vendor' in keywords:
                return "Infrastructure vendors: Construction Plus ($450K), Road Works Inc ($350K), Facility Services ($200K). Two projects completed on time."
            return self.budget_responses['infrastructure']
            
        elif 'vendor' in keywords and 'spending' in keywords:
            return self.budget_responses['vendor']
            
        elif 'anomaly' in keywords or 'suspicious' in keywords:
            return self.budget_responses['anomaly']
            
        elif 'total' in keywords and ('budget' in keywords or 'spending' in keywords):
            return self.budget_responses['total']
            
        elif 'department' in keywords:
            return self.budget_responses['department']
            
        elif intent == 'comparison' or 'compare' in nlp_result['original_query'].lower():
            return self.budget_responses['comparison']
            
        else:
            return self.budget_responses['default']
    
    def simulate_voice_input(self) -> Dict[str, any]:
        """Simulate voice input with enhanced demo queries"""
        demo_queries = [
            "How much did we spend on education last year?",
            "Show me the budget allocation for healthcare",
            "What are the top 5 vendors by spending?",
            "Are there any unusual transactions this month?",
            "What's our total budget for this year?",
            "Compare education and healthcare spending",
            "Show me healthcare vendors",
            "Find suspicious transactions in infrastructure",
            "Which department has the highest budget?",
            "List all vendor payments above fifty thousand dollars"
        ]
        
        query = random.choice(demo_queries)
        response = self.process_text_query(query)
        response['confidence'] = max(0.85, response['confidence'] - 0.1)  # Slightly lower for voice simulation
        
        return response
    
    def get_sample_queries(self) -> List[str]:
        """Get comprehensive list of sample queries for testing"""
        return [
            # Basic spending queries
            "How much did we spend on education last year?",
            "Show me the budget allocation for healthcare",
            "What's our total budget for this year?",
            
            # Vendor-related queries
            "What are the top 5 vendors by spending?",
            "Show me healthcare vendors",
            "List education department vendors",
            
            # Anomaly and analysis queries
            "Are there any unusual transactions this month?",
            "Find suspicious transactions in infrastructure", 
            "Show me transactions above $50,000",
            
            # Comparison and department queries
            "Compare education and healthcare spending",
            "Which department has the highest budget?",
            "List all active departments",
            
            # Complex queries
            "Show me vendor payments in the healthcare sector",
            "Find irregular spending patterns",
            "What's the breakdown of infrastructure costs?",
            
            # Natural language variations
            "Tell me about our education budget",
            "I want to see suspicious activities",
            "Can you show me the biggest expenses?",
            "How is our money being spent?"
        ]
    
    def get_query_statistics(self) -> Dict[str, any]:
        """Get statistics about query processing capabilities"""
        return {
            "supported_categories": list(self.budget_responses.keys()),
            "total_response_templates": len(self.budget_responses),
            "supported_intents": ["amount", "list", "comparison", "information"],
            "average_confidence": 0.87,
            "processing_speed": "~100ms",
            "nlp_features": [
                "Keyword extraction",
                "Intent detection", 
                "Confidence scoring",
                "Multi-category detection",
                "Number extraction"
            ]
        }

# Global service instance
voice_service = VoiceProcessingService()
