import pandas as pd

def calculate_credit_metrics(transactions_df: pd.DataFrame, loans_df: pd.DataFrame):
    # Monthly operating cash flow
    monthly_cf = transactions_df.groupby(
        transactions_df["date"].dt.to_period("M")
    )["amount"].sum()

    avg_monthly_cashflow = monthly_cf.mean()

    total_monthly_emi = loans_df["monthly_emi"].sum() if not loans_df.empty else 0

    # DSCR calculation
    dscr = (
        avg_monthly_cashflow / total_monthly_emi
        if total_monthly_emi > 0
        else None
    )

    lending_readiness = "LOW"
    blockers = []

    if dscr is not None:
        if dscr >= 1.5:
            lending_readiness = "HIGH"
        elif dscr >= 1.2:
            lending_readiness = "MEDIUM"
        else:
            blockers.append("Low DSCR (insufficient cash to service debt)")
    else:
        blockers.append("No existing debt data")

    if avg_monthly_cashflow <= 0:
        blockers.append("Negative operating cash flow")

    return {
        "average_monthly_cashflow": round(avg_monthly_cashflow, 2),
        "total_monthly_emi": round(total_monthly_emi, 2),
        "dscr": round(dscr, 2) if dscr else None,
        "lending_readiness": lending_readiness,
        "blockers": blockers
    }