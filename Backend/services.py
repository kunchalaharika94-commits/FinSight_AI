# Backend/services.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")

import os
import requests
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")


def _from_alpha_vantage(symbol: str):
    """Try Alpha Vantage. Returns None on rate limit / error / empty."""
    try:
        url = (
            f"https://www.alphavantage.co/query"
            f"?function=TIME_SERIES_DAILY&symbol={symbol}"
            f"&apikey={ALPHA_VANTAGE_KEY}&outputsize=compact"
        )
        r = requests.get(url, timeout=10)
        data = r.json()

        # Rate limit / errors come as "Note", "Information", or "Error Message"
        if any(k in data for k in ("Note", "Information", "Error Message")):
            return None

        ts = data.get("Time Series (Daily)")
        if not ts:
            return None

        return {"Time Series (Daily)": ts}

    except Exception:
        return None


def _from_yfinance(symbol: str):
    """Fallback: fetch from yfinance."""
    try:
        hist = yf.Ticker(symbol).history(period="6mo")
        if hist.empty:
            return None

        ts = {}
        for date, row in hist.iterrows():
            ts[date.strftime("%Y-%m-%d")] = {
                "1. open":   f"{row['Open']:.4f}",
                "2. high":   f"{row['High']:.4f}",
                "3. low":    f"{row['Low']:.4f}",
                "4. close":  f"{row['Close']:.4f}",
                "5. volume": str(int(row["Volume"])),
            }
        return {"Time Series (Daily)": ts}

    except Exception:
        return None


def get_stock_data(symbol: str):
    """Try Alpha Vantage, fall back to yfinance."""
    data = _from_alpha_vantage(symbol)
    if data:
        return data

    print(f"[FinSight] Alpha Vantage failed for {symbol}, using yfinance")
    data = _from_yfinance(symbol)
    if data:
        return data

    return {"error": f"No data available for {symbol}"}

def get_news_sentiment(symbol: str):
    """Fetches news for sentiment analysis"""
    url = f"https://newsapi.org/v2/everything?q={symbol}&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    return response.json()

def get_ai_insights(prompt: str):
    """Uses OpenRouter to generate AI financial insights"""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
    return response.json()['choices'][0]['message']['content']