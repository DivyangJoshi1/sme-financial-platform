from fastapi import APIRouter
from app.database import SessionLocal
from app.models.financial import Transaction
from app.services.financial_analysis import compute_financial_metrics, financial_health_score
import pandas as pd
from app.ai.financial_insights import generate_financial_insights
from app.models.loan import Loan
from app.services.credit_analysis import calculate_credit_metrics
from app.services.cashflow_forecast import forecast_cashflow
from app.services.cashflow_forecast import runway_analysis
from app.models.gst import GSTReturn
from app.services.gst_analysis import analyze_gst_compliance
from app.models.benchmark import IndustryBenchmark
from app.services.kpi_calculator import calculate_business_kpis
from app.services.benchmark_analysis import compare_with_benchmark
from app.services.product_recommendation import recommend_financial_products
from app.services.translator import translate_text

router = APIRouter(prefix="/analysis")

@router.get("/financial-health")
def financial_health():
    db = SessionLocal()
    transactions = db.query(Transaction).all()
    db.close()

    if not transactions:
        return {"error": "No financial data found"}

    df = pd.DataFrame([{
        "date": t.date,
        "amount": t.amount
    } for t in transactions])

    df["date"] = pd.to_datetime(df["date"])

    metrics = compute_financial_metrics(df)
    score = financial_health_score(metrics)

    return {
        "score": score,
        "metrics": metrics
    }

@router.get("/financial-insights")
def financial_insights():
    db = SessionLocal()
    transactions = db.query(Transaction).all()
    db.close()

    if not transactions:
        return {"error": "No financial data found"}

    df = pd.DataFrame([{
        "date": t.date,
        "amount": t.amount
    } for t in transactions])

    df["date"] = pd.to_datetime(df["date"])

    metrics = compute_financial_metrics(df)
    score = financial_health_score(metrics)

    insights = generate_financial_insights(score, metrics)

    return {
        "score": score,
        "metrics": metrics,
        "insights": insights
    }

@router.get("/creditworthiness")
def creditworthiness():
    db = SessionLocal()

    transactions = db.query(Transaction).all()
    loans = db.query(Loan).all()

    db.close()

    if not transactions:
        return {"error": "No financial data found"}

    tx_df = pd.DataFrame([{
        "date": t.date,
        "amount": t.amount
    } for t in transactions])

    tx_df["date"] = pd.to_datetime(tx_df["date"])

    loan_df = pd.DataFrame([{
        "monthly_emi": l.monthly_emi
    } for l in loans])

    metrics = calculate_credit_metrics(tx_df, loan_df)

    return metrics

@router.get("/cashflow-forecast")
def cashflow_forecast(months: int = 6):
    db = SessionLocal()
    transactions = db.query(Transaction).all()
    db.close()

    if not transactions:
        return {"error": "No financial data found"}

    df = pd.DataFrame([{
        "date": t.date,
        "amount": t.amount
    } for t in transactions])

    df["date"] = pd.to_datetime(df["date"])

    forecast = forecast_cashflow(df, months_ahead=months)
    runway = runway_analysis(forecast)

    return {
        **forecast,
        **runway
    }

@router.get("/gst-compliance")
def gst_compliance(lang: str = "en"):
    db = SessionLocal()
    gst_data = db.query(GSTReturn).all()
    db.close()

    if not gst_data:
        return {"error": "No GST data found"}

    df = pd.DataFrame([{
        "period": g.period,
        "output_gst": g.output_gst,
        "input_gst": g.input_gst,
        "filed": g.filed
    } for g in gst_data])

    result = analyze_gst_compliance(df)
    if lang != "en":
        result["warnings"] = [
            translate_text(w, lang) for w in result["warnings"]
        ]
    return result

@router.get("/industry-benchmark")
def industry_benchmark(industry: str = "Retail"):
    db = SessionLocal()

    benchmark = db.query(IndustryBenchmark)\
        .filter(IndustryBenchmark.industry == industry)\
        .first()

    if not benchmark:
        return {"error": "Industry benchmark not found"}

    # reuse previous metrics logic
    df = pd.read_sql("SELECT * FROM transactions", db.bind)
    if not df.empty:
        df['date'] = pd.to_datetime(df['date'])
    metrics = compute_financial_metrics(df)

    df_2 = pd.read_sql("SELECT * FROM loans", db.bind)
    dscr = calculate_credit_metrics(
        df,
        df_2,
    )

    kpis = calculate_business_kpis(metrics, dscr)
    insights = compare_with_benchmark(kpis, benchmark)

    db.close()

    return {
        "industry": industry,
        "your_kpis": kpis,
        "industry_average": {
            "gross_margin": benchmark.avg_gross_margin,
            "net_margin": benchmark.avg_net_margin,
            "cashflow_margin": benchmark.avg_cashflow_margin,
            "dscr": benchmark.avg_dscr
        },
        "insights": insights
    }

@router.get("/financial-products")
def financial_products():
    db = SessionLocal()

    transactions = pd.read_sql("SELECT * FROM transactions", db.bind)
    if not transactions.empty:
        transactions['date'] = pd.to_datetime(transactions['date'])
    loans = pd.read_sql("SELECT * FROM loans", db.bind)
    gst = pd.read_sql("SELECT * FROM gst_returns", db.bind)

    metrics = compute_financial_metrics(transactions)
    dscr = calculate_credit_metrics(transactions, loans)

    gst_score = 100
    if not gst.empty:
        unfiled = gst[gst["filed"] == 0]
        if not unfiled.empty:
            gst_score -= 30

    products = recommend_financial_products(metrics, dscr, gst_score)

    db.close()

    return {
        "recommended_products": products
    }

