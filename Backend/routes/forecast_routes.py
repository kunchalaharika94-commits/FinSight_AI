from fastapi import APIRouter, HTTPException

from src.data_collection import get_stock_data
from src.preprocessing import clean_stock_data
from src.forecasting import (
    train_forecasting_model,
    forecast_future
)

router = APIRouter(
    prefix="/api/forecast",
    tags=["Forecast"]
)


@router.get("/{ticker}")
def get_forecast(ticker: str):

    try:
        ticker = ticker.strip().upper()

        if not ticker:
            raise HTTPException(
                status_code=400,
                detail="Please enter a stock ticker."
            )

        print(f"Generating forecast for: {ticker}")

        # Get stock data
        stock_data = get_stock_data(ticker)

        # Clean stock data
        clean_data = clean_stock_data(stock_data)

        # Train forecasting model
        model, metrics = train_forecasting_model(clean_data)

        # Generate future forecast
        forecast = forecast_future(
            model,
            clean_data
        )

        return {
            "ticker": ticker,
            "forecast": forecast,
            "metrics": metrics
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"Forecast error: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )