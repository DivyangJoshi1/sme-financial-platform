# SME Financial Health Assessment Platform

An end-to-end AI-powered financial health assessment platform for Small and Medium Enterprises (SMEs).  
The system analyzes financial data, evaluates creditworthiness, checks GST compliance, benchmarks industry performance, and recommends suitable financial products — all with a simple, explainable UI.

---

##  Features

### Core Financial Analysis
- Financial health score (0–100)
- Revenue, expense, and cash flow analysis
- Debt Service Coverage Ratio (DSCR)
- Working capital insights

### GST Compliance Engine
- Output vs Input GST analysis
- Unfiled period detection
- Compliance scoring
- Refund / payable insights

### Industry Benchmarking
- Compare margins, cash flow, and DSCR against industry averages
- Supported industries:
  - Retail
  - Manufacturing
  - Services
  - E-commerce
  - Logistics (extendable)

### Financial Product Recommendations
- Term Loans
- Overdraft Facilities
- Invoice Discounting
- Working Capital Loans
- Advisory-only (for risky profiles)

### AI & Explainability
- Plain-English (and Hindi) insights
- Business-owner friendly recommendations
- Safe fallback if AI quota is unavailable

### Multilingual Support
- English 🇬🇧
- Hindi 🇮🇳 (extensible to other regional languages)

### Reports & Compliance
- Investor / bank-ready PDF reports
- Downloadable financial summaries

### Security & Access Control
- JWT authentication
- Role-based access control (RBAC)
  - SME_OWNER
  - BANK_USER
  - ADMIN
- Encrypted data at rest & in transit

---

##  Tech Stack

### Backend
- **FastAPI**
- **Python 3.11**
- **PostgreSQL**
- **SQLAlchemy**
- **Pandas**
- **JWT (python-jose)**
- **FPDF** (PDF reports)

### Frontend
- **React.js (Vite)**
- **Axios**

### AI Layer
- **OpenAI GPT (optional, quota-safe)**

### DevOps
- **Docker**
- **Docker Compose**

---

##  Project Structure

sme-financial-platform/
│
├── backend/
│ ├── app/
│ │ ├── ai/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── security/
│ │ ├── database.py
│ │ └── main.py
│ ├── create_tables.py
│ ├── requirements.txt
│ └── Dockerfile
│
├── frontend/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md


---

##  Environment Variables

Create a `.env` file in the project root.

### `.env.example`
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/sme_finance
OPENAI_API_KEY=your_openai_key_here
SECRET_KEY=change_this_secret
 Local Development (Without Docker)
1️⃣ Backend Setup
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python create_tables.py
uvicorn app.main:app --reload
Backend runs at:

http://localhost:8000
2️⃣ Frontend Setup
cd frontend
npm install
npm run dev
Frontend runs at:

http://localhost:5173
 Run with Docker (Recommended)
docker-compose up --build
Services:

Backend → http://localhost:8000

Frontend → http://localhost:5173

PostgreSQL → internal container

 Authentication & Roles
Supported Roles
Role	Permissions
SME_OWNER	Full access to own data
BANK_USER	Read-only reports
ADMIN	Full system access
JWT is required for protected endpoints.

 API Endpoints (Sample)
Endpoint	Description
/analysis/financial-insights	Financial health metrics
/analysis/gst-compliance	GST risk & compliance
/analysis/industry-benchmark	Industry comparison
/analysis/financial-products	Credit recommendations
/reports/download	PDF financial report
 PDF Reports
Generated on-demand

Bank & investor friendly

Secure role-based access

Downloadable via API

 AI Usage Notes
AI is used only for narrative insights & translation

Core financial logic is deterministic

System works even if AI quota is exceeded

Roadmap
Bank API integrations (Account Aggregator)

GSTN API integration

Cloud deployment (AWS / GCP)

Advanced forecasting models

Multi-tenant SaaS support

⚠️ Disclaimer
This platform provides financial insights and recommendations only.
It does not constitute legal, tax, or financial advice.

Contributing
Pull requests are welcome.
For major changes, please open an issue first.

 License
MIT License
