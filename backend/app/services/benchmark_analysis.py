def compare_with_benchmark(kpis, benchmark):
    insights = []

    def compare(name, value, benchmark_value):
        if value >= benchmark_value:
            return f"{name} is above industry average"
        else:
            return f"{name} is below industry average"

    insights.append(compare("Gross Margin", kpis["gross_margin"], benchmark.avg_gross_margin))
    insights.append(compare("Net Margin", kpis["net_margin"], benchmark.avg_net_margin))
    insights.append(compare("Cash Flow Margin", kpis["cashflow_margin"], benchmark.avg_cashflow_margin))
    insights.append(compare("DSCR", kpis["dscr"], benchmark.avg_dscr))

    return insights