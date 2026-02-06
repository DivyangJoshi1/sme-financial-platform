import pandas as pd

def compute_financial_metrics(df: pd.DataFrame):
    # Ensure date column is datetime type
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    
    revenue = df[df["amount"] > 0]["amount"].sum()
    expenses = abs(df[df["amount"] < 0]["amount"].sum())
    net_profit = revenue - expenses
    profit_margin = (net_profit / revenue) if revenue > 0 else 0

    monthly_cashflow = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
    negative_months = monthly_cashflow[monthly_cashflow < 0]
    avg_monthly_burn = abs(negative_months.mean()) if len(negative_months) > 0 else 0

    cash_balance = df["amount"].sum()
    runway_months = (cash_balance / avg_monthly_burn) if avg_monthly_burn > 0 else None

    return {
        "revenue": revenue if pd.notna(revenue) else 0,
        "expenses": expenses if pd.notna(expenses) else 0,
        "net_profit": net_profit if pd.notna(net_profit) else 0,
        "net_cashflow": cash_balance if pd.notna(cash_balance) else 0,
        "profit_margin": (profit_margin * 100) if pd.notna(profit_margin) else 0,
        "cash_balance": cash_balance if pd.notna(cash_balance) else 0,
        "avg_monthly_burn": avg_monthly_burn if pd.notna(avg_monthly_burn) else 0,
        "runway_months": runway_months if pd.notna(runway_months) else None
    }


def financial_health_score(metrics: dict):
    score = 0

    if metrics["profit_margin"] > 20:
        score += 30
    elif metrics["profit_margin"] > 10:
        score += 20
    else:
        score += 10

    if metrics["runway_months"] and metrics["runway_months"] > 6:
        score += 30
    elif metrics["runway_months"]:
        score += 20
    else:
        score += 10

    if metrics["cash_balance"] > 0:
        score += 20

    score += 20  # baseline stability

    return min(score, 100)