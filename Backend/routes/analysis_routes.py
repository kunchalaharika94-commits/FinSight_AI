from fastapi import APIRouter, HTTPException

from src.data_collection import collect_all_data

router = APIRouter(
    prefix="/api/analysis",
    tags=["Analysis"]
)


@router.get("/{ticker}")
def analyze_stock(ticker: str):

    try:
        # Convert user input to uppercase
        ticker = ticker.strip().upper()

        if not ticker:
            raise HTTPException(
                status_code=400,
                detail="Please enter a stock ticker."
            )

        print(f"Analyzing: {ticker}")

        # Collect data for the company entered by the user
        data = collect_all_data(ticker)

        return {
            "ticker": ticker,
            "stock": data.get("stock"),
            "overview": data.get("overview"),
            "income": data.get("income"),
            "balance": data.get("balance"),
            "cash_flow": data.get("cash_flow"),
            "news": data.get("news")
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"Analysis error: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )