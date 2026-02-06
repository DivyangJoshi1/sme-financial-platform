from fastapi import FastAPI
from app.routes import upload, analysis, reports
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="SME Financial Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sme-financial-platform.vercel.app",
        "http://localhost:5173"
    ],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload.router)
app.include_router(analysis.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
