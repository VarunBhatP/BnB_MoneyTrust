from models.nlp_processor import SimpleNLPProcessor

# Test the NLP processor
processor = SimpleNLPProcessor()

test_queries = [
    "How much did we spend on education?",
    "Show me healthcare vendors",
    "Any suspicious transactions?"
]

for query in test_queries:
    result = processor.process_query(query)
    print(f"Query: {query}")
    print(f"Result: {result}")
    print("-" * 30)
