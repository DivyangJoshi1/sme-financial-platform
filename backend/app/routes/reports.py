from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from app.services.report_generator import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/download")
def download_report():

    # normally you'd calculate this dynamically
    summary = {
        "Financial Health Score": 78,
        "DSCR": 1.6,
        "GST Compliance": "Medium Risk",
        "Recommended Product": "Working Capital Loan"
    }

    file_path = generate_pdf_report(summary)

    return FileResponse(
        path=file_path,
        filename="SME_Financial_Report.pdf",
        media_type="application/pdf"
    )