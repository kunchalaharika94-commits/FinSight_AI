import numpy as np

from sklearn.ensemble import IsolationForest


def detect_anomalies(stock_data):

    df = stock_data.copy()

    # Daily return
    df["Return"] = (
        df["Close"]
        .pct_change()
        .fillna(0)
    )

    # Volume change
    df["Volume_Change"] = (
        df["Volume"]
        .pct_change()
        .replace(
            [np.inf, -np.inf],
            0
        )
        .fillna(0)
    )

    features = df[
        [
            "Return",
            "Volume_Change"
        ]
    ]

    model = IsolationForest(
        n_estimators=200,
        contamination=0.03,
        random_state=42
    )

    predictions = model.fit_predict(
        features
    )

    df["Anomaly"] = (
        predictions == -1
    )

    return df