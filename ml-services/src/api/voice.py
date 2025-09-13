from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random

router = APIRouter()

class VoiceQuery(BaseModel):
    text: str

class VoiceResponse(BaseModel):
    query: str
    answer: str
    confidence: float

@router.post("/text-query", response_model=VoiceResponse)
async def process_text_query(query: VoiceQuery):
    """Process text query about budget data"""
    try:
        answer = process_budget_query(query.text)
        
        return VoiceResponse(
            query=query.text,
            answer=answer,
            confidence=0.95
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/simulate-voice", response_model=VoiceResponse)
async def simulate_voice_input():
    """Simulate voice input for demo purposes"""
    demo_queries = [
        "How much did we spend on education last year?",
        "Show me the budget allocation for healthcare",
        "What are the top 5 vendors by spending?",
        "Are there any unusual transactions this month?"
    ]
    
    query = random.choice(demo_queries)
    answer = process_budget_query(query)
    
    return VoiceResponse(
        query=query,
        answer=answer,
        confidence=0.88
    )

def process_budget_query(query: str) -> str:
    """Process budget-related natural language queries"""
    query_lower = query.lower()
    
    if "education" in query_lower:
        return "Education department received $5.2M this year (35% of total budget). Breakdown: Teacher salaries $3.2M, Equipment $1.5M, Facilities $500K."
    
    elif "healthcare" in query_lower:
        return "Healthcare budget is $3.1M (21% of total). Breakdown: Medical staff $2M, Equipment $800K, Medicine supplies $300K."
    
    elif "vendor" in query_lower:
        return "Top vendors by spending: 1) TechCorp Ltd ($800K), 2) EduSupply Inc ($700K), 3) Medical Supplies Co ($600K), 4) Construction Plus ($450K), 5) Office Mart ($300K)."
    
    elif "unusual" in query_lower or "anomal" in query_lower:
        return "Found 3 unusual transactions this month: $75K payment to new vendor, $45K after-hours transaction, and duplicate $12K payments. All flagged for review."
    
    elif "total" in query_lower or "budget" in query_lower:
        return "Total institutional budget is $14.8M for fiscal year 2024. Allocation: Education (35%), Healthcare (21%), Infrastructure (14%), Administration (12%), Research (10%), Other (8%)."
    
    else:
        return "I can help you with budget information. Try asking about education spending, healthcare budget, top vendors, unusual transactions, or total budget allocation."

@router.get("/demo-queries")
async def get_demo_queries():
    """Get sample voice queries for testing"""
    return {
        "sample_queries": [
            "How much did we spend on education last year?",
            "Show me the budget allocation for healthcare",
            "What are the top 5 vendors by spending?",
            "Are there any unusual transactions this month?",
            "What's our total budget for this year?",
            "Which department has the highest spending?"
        ]
    }
