import streamlit as st
import pandas as pd
import plotly.express as px


from src.data_collection import (
    collect_all_data
)

from src.preprocessing import (
    clean_stock_data,
    clean_news_data
)

from src.ratio_analysis import (
    ratio_analysis
)

from src.ml_analysis import (
    detect_anomalies
)

from src.nlp_analysis import (
    analyze_sentiment
)

from src.forecasting import (
    train_forecasting_model,
    forecast_future
)

from src.risk_analysis import (
    calculate_risk_score
)

from src.xai import (
    explain_model
)

from src.llm_explanation import (
    generate_ai_explanation
)


# ==================================================
# PAGE CONFIGURATION
# ==================================================

st.set_page_config(

    page_title="FinSight AI",

    page_icon="📊",

    layout="wide"
)


# ==================================================
# TITLE
# ==================================================

st.title(
    "📊 FinSight AI"
)

st.subheader(
    "Integrated Financial Intelligence Platform"
)

st.write(
    "AI-powered financial analytics, "
    "forecasting, risk analysis and "
    "decision support."
)


# ==================================================
# SIDEBAR
# ==================================================

st.sidebar.header(
    "Company Analysis"
)

ticker = st.sidebar.text_input(

    "Enter Stock Ticker",

    "AAPL"
).upper()


run = st.sidebar.button(
    "Run Analysis"
)


# ==================================================
# RUN SYSTEM
# ==================================================

if run:

    with st.spinner(
        "Collecting financial data..."
    ):

        data = collect_all_data(
            ticker
        )


    # ==================================================
    # PREPROCESSING
    # ==================================================

    stock = clean_stock_data(
        data["stock"]
    )

    news = clean_news_data(
        data["news"]
    )


    # ==================================================
    # RATIO ANALYSIS
    # ==================================================

    ratios = ratio_analysis(

        data["overview"],

        data["income"],

        data["balance"]
    )


    # ==================================================
    # ML ANOMALY DETECTION
    # ==================================================

    anomaly_data = detect_anomalies(
        stock
    )


    # ==================================================
    # NLP
    # ==================================================

    news, sentiment = analyze_sentiment(
        news
    )


    # ==================================================
    # FORECASTING
    # ==================================================

    model, predictions, metrics = (
        train_forecasting_model(
            stock
        )
    )


    future_forecast = forecast_future(

        model,

        stock,

        days=30
    )


    # ==================================================
    # RISK
    # ==================================================

    risk = calculate_risk_score(

        stock,

        ratios,

        anomaly_data,

        sentiment
    )


    # ==================================================
    # XAI
    # ==================================================

    xai = explain_model(
        model
    )


    # ==================================================
    # DASHBOARD
    # ==================================================

    st.success(
        "Analysis completed successfully!"
    )


    # ==================================================
    # KPI CARDS
    # ==================================================

    col1, col2, col3, col4 = (
        st.columns(4)
    )


    col1.metric(

        "Latest Price",

        f"${stock['Close'].iloc[-1]:.2f}"
    )


    col2.metric(

        "Risk Score",

        f"{risk['score']}/100"
    )


    col3.metric(

        "Risk Level",

        risk["level"]
    )


    col4.metric(

        "Sentiment",

        sentiment["average"]
    )


    # ==================================================
    # PRICE CHART
    # ==================================================

    st.header(
        "📈 Historical Stock Price"
    )

    figure = px.line(

        stock,

        x=stock.index,

        y="Close",

        title=f"{ticker} Historical Price"
    )

    st.plotly_chart(

        figure,

        use_container_width=True
    )


    # ==================================================
    # FINANCIAL RATIOS
    # ==================================================

    st.header(
        "💰 Financial Ratios"
    )

    ratio_df = pd.DataFrame(

        list(ratios.items()),

        columns=[
            "Indicator",
            "Value"
        ]
    )

    st.dataframe(
        ratio_df,
        use_container_width=True
    )


    # ==================================================
    # ANOMALIES
    # ==================================================

    st.header(
        "🚨 Market Anomaly Detection"
    )

    anomalies = anomaly_data[
        anomaly_data["Anomaly"]
    ]

    st.write(
        f"Detected {len(anomalies)} "
        "potentially unusual observations."
    )

    st.dataframe(
        anomalies[
            [
                "Close",
                "Volume",
                "Return"
            ]
        ].tail(20)
    )


    # ==================================================
    # FORECAST
    # ==================================================

    st.header(
        "🔮 Price Forecast"
    )

    historical_prediction = predictions.reset_index()

    historical_prediction.rename(

        columns={
            "index": "Date"
        },

        inplace=True
    )


    figure = px.line(

        historical_prediction,

        x="Date",

        y=[
            "Actual",
            "Predicted"
        ],

        title="Actual vs Predicted"
    )

    st.plotly_chart(

        figure,

        use_container_width=True
    )


    st.subheader(
        "Next 30 Business Days"
    )

    st.dataframe(
        future_forecast
    )


    # ==================================================
    # MODEL METRICS
    # ==================================================

    st.write(
        f"MAE: {metrics['MAE']:.3f}"
    )

    st.write(
        f"RMSE: {metrics['RMSE']:.3f}"
    )


    # ==================================================
    # SENTIMENT
    # ==================================================

    st.header(
        "📰 Financial News Sentiment"
    )

    c1, c2, c3 = (
        st.columns(3)
    )

    c1.metric(
        "Positive",
        sentiment["positive"]
    )

    c2.metric(
        "Negative",
        sentiment["negative"]
    )

    c3.metric(
        "Neutral",
        sentiment["neutral"]
    )

    st.dataframe(

        news[
            [
                "publishedAt",
                "title",
                "Sentiment_Label",
                "Sentiment",
                "url"
            ]
        ].head(30),

        use_container_width=True
    )


    # ==================================================
    # XAI
    # ==================================================

    st.header(
        "🧠 Explainable AI"
    )

    for feature, importance in xai[:5]:

        st.write(

            f"**{feature}** → "
            f"{importance:.2%}"
        )


    # ==================================================
    # LLM
    # ==================================================

    st.header(
        "🤖 AI Financial Insights"
    )

    explanation = generate_ai_explanation(

        ticker,

        ratios,

        risk,

        sentiment,

        metrics,

        xai
    )

    st.write(
        explanation
    )


else:

    st.info(

        "Enter a stock ticker and "
        "click 'Run Analysis'."
    )