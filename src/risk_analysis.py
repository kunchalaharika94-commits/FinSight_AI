def calculate_risk_score(
    stock_data,
    ratios,
    anomaly_data,
    sentiment
):

    returns = (
        stock_data["Close"]
        .pct_change()
        .dropna()
    )

    volatility = returns.std()

    beta = ratios.get(
        "Beta",
        1
    )

    debt_ratio = ratios.get(
        "Debt-to-Asset",
        0
    )

    anomaly_rate = (
        anomaly_data["Anomaly"]
        .mean()
    )

    negative_sentiment = max(
        0,
        -sentiment["average"]
    )

    # -----------------------------
    # NORMALIZATION
    # -----------------------------

    volatility_score = min(
        volatility / 0.05,
        1
    )

    beta_score = min(
        abs(beta) / 2,
        1
    )

    debt_score = min(
        debt_ratio,
        1
    )

    anomaly_score = min(
        anomaly_rate / 0.10,
        1
    )

    sentiment_score = min(
        negative_sentiment,
        1
    )

    # -----------------------------
    # FINAL SCORE
    # -----------------------------

    score = (

        volatility_score * 30

        +

        beta_score * 20

        +

        debt_score * 25

        +

        anomaly_score * 15

        +

        sentiment_score * 10
    )

    score = round(score)

    if score < 35:

        level = "Low"

    elif score < 65:

        level = "Moderate"

    else:

        level = "High"

    return {

        "score": score,

        "level": level,

        "volatility": volatility,

        "anomaly_rate":
            anomaly_rate
    }