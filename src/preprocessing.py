import pandas as pd
import numpy as np


def clean_stock_data(data):

    df = data.copy()

    # Remove duplicate dates
    df = df[
        ~df.index.duplicated(
            keep="last"
        )
    ]

    # Sort dates
    df = df.sort_index()

    # Convert numerical columns
    numeric_columns = [
        "Open",
        "High",
        "Low",
        "Close",
        "Volume"
    ]

    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Replace infinity
    df = df.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # Remove missing values
    df = df.dropna()

    return df


def clean_news_data(news):
    if not news:
        return pd.DataFrame(columns=["title", "description", "content"])

    news_df = pd.DataFrame(news)

    for column in ["title", "description", "content"]:
        if column not in news_df.columns:
            news_df[column] = ""

        news_df[column] = news_df[column].fillna("")

    news_df["text"] = (
        news_df["title"] + " " +
        news_df["description"] + " " +
        news_df["content"]
    ).str.strip()

    news_df = news_df[news_df["text"] != ""]

    return news_df


def calculate_returns(stock_data):

    df = stock_data.copy()

    df["Daily_Return"] = (
        df["Close"].pct_change()
    )

    return df


def calculate_volatility(stock_data):

    returns = (
        stock_data["Close"]
        .pct_change()
        .dropna()
    )

    annual_volatility = (
        returns.std() *
        np.sqrt(252)
    )

    return annual_volatility