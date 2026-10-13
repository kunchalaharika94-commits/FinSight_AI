from fastapi import APIRouter, HTTPException

from src.data_collection import get_news

router = APIRouter(
    prefix="/api/news",
    tags=["News"]
)


@router.get("/{ticker}")
def get_company_news(ticker: str):

    try:
        ticker = ticker.strip().upper()

        if not ticker:
            raise HTTPException(
                status_code=400,
                detail="Please enter a stock ticker."
            )

        print(f"Fetching news for: {ticker}")

        news = get_news(ticker)

        return {
            "ticker": ticker,
            "news": news
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"News error: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )