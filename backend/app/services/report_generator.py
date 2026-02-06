from fpdf import FPDF
from datetime import datetime

def generate_pdf_report(summary: dict):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)

    pdf.cell(200, 10, "SME Financial Health Report", ln=True)

    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, f"Generated on: {datetime.now()}", ln=True)
    pdf.ln(5)

    for k, v in summary.items():
        pdf.cell(200, 10, f"{k}: {v}", ln=True)

    file_path = "sme_financial_report.pdf"
    pdf.output(file_path)

    return file_path