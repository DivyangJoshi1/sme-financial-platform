import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def translate_text(text: str, target_lang: str):
    if target_lang == "en":
        return text

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": f"Translate the following business text to Hindi in simple language:\n{text}"
                }
            ]
        )
        return response.choices[0].message.content
    except Exception:
        # fail safe
        return text