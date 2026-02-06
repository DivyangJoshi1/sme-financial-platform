import pandas as pd

def analyze_gst_compliance(df: pd.DataFrame):
    df["gst_payable"] = df["output_gst"] - df["input_gst"]

    total_output = df["output_gst"].sum()
    total_input = df["input_gst"].sum()
    total_payable = df["gst_payable"].sum()

    unfiled_periods = df[df["filed"] == 0]["period"].tolist()

    score = 100
    warnings = []

    if unfiled_periods:
        score -= 30
        warnings.append(f"GST not filed for periods: {', '.join(unfiled_periods)}")

    if total_payable < 0:
        warnings.append("Excess input GST available for refund")

    if total_output == 0:
        score -= 20
        warnings.append("No GST output detected — check sales reporting")

    return {
        "total_output_gst": round(total_output, 2),
        "total_input_gst": round(total_input, 2),
        "net_gst_payable": round(total_payable, 2),
        "unfiled_periods": unfiled_periods,
        "compliance_score": max(score, 0),
        "warnings": warnings
    }