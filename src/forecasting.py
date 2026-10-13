import numpy as np
import pandas as pd

from sklearn.ensemble import (
    RandomForestRegressor
)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error
)


def create_lag_features(
    stock_data,
    number_of_lags=10
):

    df = stock_data[
        ["Close"]
    ].copy()

    for i in range(
        1,
        number_of_lags + 1
    ):

        df[
            f"Lag_{i}"
        ] = df["Close"].shift(i)

    df = df.dropna()

    return df


def train_forecasting_model(
    stock_data,
    lags=10
):

    df = create_lag_features(
        stock_data,
        lags
    )

    X = df.drop(
        columns=["Close"]
    )

    y = df["Close"]

    # 80% training
    split = int(
        len(df) * 0.8
    )

    X_train = X.iloc[:split]
    X_test = X.iloc[split:]

    y_train = y.iloc[:split]
    y_test = y.iloc[split:]

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        n_jobs=-1
    )

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )

    result = pd.DataFrame({

        "Actual": y_test.values,

        "Predicted": predictions

    }, index=y_test.index)

    metrics = {

        "MAE": mae,

        "RMSE": rmse
    }

    return (
        model,
        result,
        metrics
    )


def forecast_future(
    model,
    stock_data,
    days=30,
    lags=10
):

    history = (
        stock_data["Close"]
        .tolist()
    )

    future_values = []

    for _ in range(days):

        latest_values = (
            history[-lags:]
        )

        features = np.array(
            latest_values[::-1]
        ).reshape(1, -1)

        prediction = (
            model.predict(features)[0]
        )

        future_values.append(
            prediction
        )

        history.append(
            prediction
        )

    dates = pd.bdate_range(

        start=(
            stock_data.index[-1]
            + pd.Timedelta(days=1)
        ),

        periods=days
    )

    forecast = pd.DataFrame({

        "Date": dates,

        "Predicted_Price":
            future_values
    })

    return forecast