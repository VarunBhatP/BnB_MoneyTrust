# 🤖 BnB MoneyTrust – AI/ML Financial Transparency Platform  

AI-powered platform for **financial anomaly detection** and **natural language insights**.  

🔗 **Live Demo:** [API Docs](https://bnb-ai-ml-services.onrender.com/docs)  

---

## 🌟 Features  
- 🔍 **Anomaly Detection** (Isolation Forest ML, vendor & temporal anomalies)  
- 🎤 **NLP Queries** (ask in plain English, intent & entity extraction)  
- 📊 **Monitoring** (health, stats, system metrics)  

---

## 🚀 Quick Start  

```bash
# Clone & Setup
git clone https://github.com/VarunBhatP/BnB_MoneyTrust.git
cd BnB_MoneyTrust/ml-services
python -m venv ml_env && source ml_env/bin/activate
pip install -r requirements.txt

# Run server
cd src && python main.py
Docs: http://localhost:8001/docs

📂 Project Structure

ml-services/
├── src/
│   ├── main.py          # FastAPI entry
│   ├── api/             # Routes (anomaly, voice, health)
│   ├── models/          # ML models
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   └── config/          # Settings
├── data/                # Sample data
├── requirements.txt
└── .env

📋 API Endpoints

Anomaly Detection → /api/anomaly/detect, /api/anomaly/batch-analyze

NLP Queries → /api/voice/text-query, /api/voice/demo-queries

Health → /api/health/, /api/health/stats, /api/health/models

🧠 AI Capabilities

Detects high-value transactions, duplicates, vendor anomalies

NLP for budgets, departments, vendors

Confidence scoring for answers

📌 Example Queries:

"How much did we spend on education?"

"List top vendors by spending."

"Any unusual healthcare transactions?"


📜 License

MIT License © 2025

