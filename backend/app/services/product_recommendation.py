def recommend_financial_products(metrics, dscr, gst_score):
    recommendations = []

    cashflow = metrics.get("net_cashflow", 0)
    revenue = metrics.get("revenue", 0)
    
    # Extract DSCR from credit_metrics dictionary
    dscr = dscr.get("dscr") if isinstance(dscr, dict) else dscr

    if dscr and dscr >= 1.8 and cashflow > 0:
        recommendations.append({
            "product": "Term Loan",
            "reason": "Strong debt servicing capacity and stable cash flows"
        })

    if cashflow < 0:
        recommendations.append({
            "product": "Overdraft Facility",
            "reason": "Short-term liquidity mismatch detected"
        })

    receivables_ratio = metrics.get("receivables_ratio", 0)

    if receivables_ratio > 0.3:
        recommendations.append({
            "product": "Invoice Discounting",
            "reason": "High capital locked in receivables"
        })

    if gst_score < 70:
        recommendations.append({
            "product": "Advisory Only",
            "reason": "GST compliance risk — credit not recommended yet"
        })

    if not recommendations:
        recommendations.append({
            "product": "No Credit Required",
            "reason": "Business is self-sustaining currently"
        })

    return recommendations