import os
import requests
import pandas as pd
import yfinance as yf

from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

NEWS_API_URL = "https://newsapi.org/v2/everything"

# --------------------------------------------------
# HISTORICAL STOCK DATA
# --------------------------------------------------

def get_stock_data(ticker, period="5y"):

    print("Collecting historical stock data...")

    data = yf.download(
        ticker,
        period=period,
        auto_adjust=False,
        progress=False
    )

    if data.empty:
        raise ValueError("No stock data found.")

    # Handle MultiIndex returned by newer yfinance versions
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    data = data[
        ["Open", "High", "Low", "Close", "Volume"]
    ]

    return data


# --------------------------------------------------
# ALPHA VANTAGE
# --------------------------------------------------

def alpha_vantage_request(function, ticker):

    url = "https://www.alphavantage.co/query"

    params = {
        "function": function,
        "symbol": ticker,
        "apikey": ALPHA_VANTAGE_KEY
    }

    response = requests.get(
        url,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    return response.json()


# --------------------------------------------------
# COMPANY INFORMATION
# --------------------------------------------------

def get_company_overview(ticker):

    return alpha_vantage_request(
        "OVERVIEW",
        ticker
    )


# --------------------------------------------------
# INCOME STATEMENT
# --------------------------------------------------

def get_income_statement(ticker):

    return alpha_vantage_request(
        "INCOME_STATEMENT",
        ticker
    )


# --------------------------------------------------
# BALANCE SHEET
# --------------------------------------------------

def get_balance_sheet(ticker):

    return alpha_vantage_request(
        "BALANCE_SHEET",
        ticker
    )


# --------------------------------------------------
# CASH FLOW
# --------------------------------------------------

def get_cash_flow(ticker):

    return alpha_vantage_request(
        "CASH_FLOW",
        ticker
    )


# --------------------------------------------------
# NEWS
# --------------------------------------------------

def get_news(query):
    if not NEWS_API_KEY:
        print("NewsAPI key not configured.")
        return []

    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 50
    }

    headers = {
        "X-Api-Key": NEWS_API_KEY
    }

    try:
        response = requests.get(
            NEWS_API_URL,
            params=params,
            headers=headers,
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        print("NewsAPI status:", response.status_code)
        print("NewsAPI response:", data)

        if data.get("status") != "ok":
            print("NewsAPI error:", data)
            return []

        return data.get("articles", [])

    except requests.exceptions.Timeout:
        print("NewsAPI connection timed out. Continuing without news.")
        return []

    except requests.exceptions.ConnectionError:
        print("Could not connect to NewsAPI. Continuing without news.")
        return []

    except requests.exceptions.HTTPError as e:
        print("NewsAPI HTTP error:", e)
        return []

    except Exception as e:
        print("Unexpected NewsAPI error:", e)
        return []

def collect_all_data(ticker):
    print(f"Collecting all financial data for {ticker}...")

    stock_data = get_stock_data(ticker)
    company_overview = get_company_overview(ticker)
    income_statement = get_income_statement(ticker)
    balance_sheet = get_balance_sheet(ticker)
    cash_flow = get_cash_flow(ticker)
    news = get_news(ticker)

    return {
        "stock": stock_data,
        "overview": company_overview,
        "income": income_statement,
        "balance": balance_sheet,
        "cash_flow": cash_flow,
        "news": news
    }