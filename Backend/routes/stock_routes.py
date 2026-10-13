from fastapi import APIRouter, HTTPException

from src.data_collection import get_stock_data

router = APIRouter(
    prefix="/api/stock",
    tags=["Stock"]
)


@router.get("/{ticker}")
def get_stock(ticker: str):

    try:
        ticker = ticker.strip().upper()

        if not ticker:
            raise HTTPException(
                status_code=400,
                detail="Please enter a stock ticker."
            )

        print(f"Fetching stock data for: {ticker}")

        stock_data = get_stock_data(ticker)

        return {
            "ticker": ticker,
            "stock": stock_data.to_dict(orient="records")
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"Stock error: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )