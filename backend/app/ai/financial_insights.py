from openai import OpenAI
from app.config import OPENAI_API_KEY
import logging

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_financial_insights(score: int, metrics: dict, language="en"):
    prompt = f"""
You are a financial advisor for small businesses.

Financial Health Score: {score}

Metrics:
Revenue: {metrics['revenue']}
Expenses: {metrics['expenses']}
Profit Margin: {metrics['profit_margin']}%
Cash Balance: {metrics['cash_balance']}
Runway (months): {metrics['runway_months']}

Explain:
1. What this score means
2. Top 3 risks
3. Top 3 improvements
Use very simple language.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content

    except Exception as e:
        logging.error(f"AI insight generation failed: {e}")

        # ✅ SAFE FALLBACK (CRITICAL)
        return (
            "AI insights are temporarily unavailable.\n\n"
            "Basic interpretation:\n"
            f"- Financial Health Score: {score}\n"
            "- Review expenses and cash flow carefully.\n"
            "- Ensure at least 6 months of cash runway.\n"
            "- Improve profit margins and reduce fixed costs."
        )