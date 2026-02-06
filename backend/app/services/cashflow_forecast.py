import pandas as pd

def forecast_cashflow(df: pd.DataFrame, months_ahead=6):
    # Group by month
    monthly_cf = df.groupby(
        df["date"].dt.to_period("M")
    )["amount"].sum().sort_index()

    if len(monthly_cf) < 2:
        return {
            "error": "Not enough data to forecast"
        }

    # Simple moving average (last 3 months)
    rolling_avg = monthly_cf.tail(3).mean()

    last_month = monthly_cf.index[-1]
    forecast = {}

    current_balance = df["amount"].sum()
    balance = current_balance

    for i in range(1, months_ahead + 1):
        forecast_month = (last_month + i).strftime("%Y-%m")
        balance += rolling_avg

        forecast[forecast_month] = {
            "expected_cashflow": round(rolling_avg, 2),
            "expected_balance": round(balance, 2)
        }

    return {
        "current_cash_balance": round(current_balance, 2),
        "average_monthly_cashflow": round(rolling_avg, 2),
        "forecast": forecast
    }

def runway_analysis(forecast_data):
    warnings = []

    avg_cf = forecast_data.get("average_monthly_cashflow")
    balance = forecast_data.get("current_cash_balance")

    if avg_cf < 0:
        runway_months = abs(balance / avg_cf)
        warnings.append("Business is cash negative")
    else:
        runway_months = None

    if runway_months and runway_months < 3:
        warnings.append("CRITICAL: Less than 3 months runway")

    return {
        "runway_months": round(runway_months, 1) if runway_months else None,
        "warnings": warnings
    }

