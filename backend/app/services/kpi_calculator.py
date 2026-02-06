def calculate_business_kpis(metrics, credit_metrics):
    revenue = metrics.get("revenue", 0)
    expenses = metrics.get("expenses", 0)
    cashflow = metrics.get("net_cashflow", 0)
    
    # Extract DSCR from credit_metrics dictionary
    dscr = credit_metrics.get("dscr") if isinstance(credit_metrics, dict) else credit_metrics

    gross_margin = ((revenue - expenses) / revenue) * 100 if revenue else 0
    net_margin = (cashflow / revenue) * 100 if revenue else 0
    cashflow_margin = net_margin

    return {
        "gross_margin": round(gross_margin, 2),
        "net_margin": round(net_margin, 2),
        "cashflow_margin": round(cashflow_margin, 2),
        "dscr": round(dscr, 2) if dscr else None
    }