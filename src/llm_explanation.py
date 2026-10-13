import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# OpenRouter configuration
API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY
)


def generate_ai_explanation(
    ticker,
    ratios,
    risk,
    sentiment,
    metrics,
    xai
):

    prompt = f"""
You are a financial analysis assistant for FinSight AI.

Analyze the following results for the company/stock: {ticker}

FINANCIAL RATIOS:
{ratios}

RISK ANALYSIS:
{risk}

NEWS SENTIMENT:
{sentiment}

FORECAST MODEL METRICS:
{metrics}

EXPLAINABLE AI RESULTS:
{xai}

Based ONLY on the information provided above, generate a clear financial analysis.

Include the following sections:

1. Overall Financial Situation
2. Financial Ratio Insights
3. Risk Analysis
4. News Sentiment
5. Forecast Analysis
6. Explainable AI Findings
7. Overall Summary

Rules:
- Do not invent any numbers or financial information.
- Use simple language.
- Explain the important findings clearly.
- Mention that the analysis is AI-generated.
- Mention that this is not financial advice.
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        return (
            "Unable to generate AI Financial Insights.\n\n"
            f"Error: {str(e)}"
        )