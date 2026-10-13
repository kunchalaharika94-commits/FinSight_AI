# Backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, auth
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine) # Creates MySQL tables automatically

app = FastAPI()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allow React frontend to communicate
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas for Request Body
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = auth.get_password_hash(user.password)   # ✅ hashes
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd                        # ✅ stored in hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer", "username": db_user.username}
# Add to main.py
from services import get_stock_data, get_news_sentiment, get_ai_insights

class ForgotPasswordRequest(BaseModel):
    email: str

@app.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        print(f"[FinSight] Password reset requested for {req.email}")
    return {"message": "If the email exists, a reset link has been sent."}

@app.get("/api/stock/{symbol}")
def stock_analysis(symbol: str):
    data = get_stock_data(symbol)
    ts = data.get("Time Series (Daily)", {})
    if not ts:
        return {"error": "No data", "raw": data}
    latest_date = sorted(ts.keys())[-1]
    latest = ts[latest_date]
    closes = [float(v["4. close"]) for v in ts.values()]
    return {
        "symbol": symbol,
        "stock": {
            "close": float(latest["4. close"]),
            "open": float(latest["1. open"]),
            "high": float(latest["2. high"]),
            "low": float(latest["3. low"]),
            "volume": int(latest["5. volume"]),
            "price": float(latest["4. close"]),
            "history": [
                {"date": d, "close": float(v["4. close"])}
                for d, v in sorted(ts.items())
            ],
        },
        "overview": {
            "Name": symbol,
            "Sector": "—",
            "MarketCapitalization": "—",
        },
        "ratios": {},
        "risk": {},
        "sentiment": {},
        "ai_insights": "Live AI insights coming soon.",
    }

@app.get("/api/sentiment/{symbol}")
def sentiment_analysis(symbol: str):
    news = get_news_sentiment(symbol)
    # Pass news headlines to AI for sentiment
    prompt = f"Analyze the sentiment of these news headlines for {symbol}: {news}"
    return {"sentiment": get_ai_insights(prompt)}

@app.get("/api/risk/{symbol}")
def risk_analysis(symbol: str):
    stock = get_stock_data(symbol)
    prices = [
        float(v["4. close"])
        for v in stock.get("Time Series (Daily)", {}).values()
    ]
    if not prices:
        return {"symbol": symbol, "risk": {}, "error": "No data"}
    import statistics
    returns = [(prices[i] - prices[i+1]) / prices[i+1] for i in range(len(prices)-1)]
    volatility = statistics.pstdev(returns) if len(returns) > 1 else 0
    score = min(100, int(volatility * 1000))
    level = "Low" if score < 35 else "Medium" if score < 70 else "High"
    return {
        "symbol": symbol,
        "risk": {
            "score": score,
            "level": level,
            "volatility": round(volatility, 4),
            "anomaly_rate": 0.02,
        },
    }


@app.get("/api/fraud/{symbol}")
def fraud_analysis(symbol: str):
    stock = get_stock_data(symbol)
    prices = [
        float(v["4. close"])
        for v in stock.get("Time Series (Daily)", {}).values()
    ]
    anomalies = []
    if len(prices) > 20:
        mean = sum(prices) / len(prices)
        std = (sum((p - mean) ** 2 for p in prices) / len(prices)) ** 0.5
        for i, p in enumerate(prices):
            z = (p - mean) / std if std else 0
            if abs(z) > 2:
                anomalies.append({"day": i, "price": p, "z_score": round(z, 2)})
    return {
        "symbol": symbol,
        "anomalies": anomalies[:10],
        "fraud_score": round(len(anomalies) / max(len(prices), 1), 3),
    }


@app.get("/api/forecast/{symbol}")
def forecast_analysis(symbol: str):
    stock = get_stock_data(symbol)
    ts = stock.get("Time Series (Daily)", {})
    if not ts:
        return {"symbol": symbol, "error": "No data"}

    # Sort ascending by date
    dates = sorted(ts.keys())
    closes = [float(ts[d]["4. close"]) for d in dates]

    if len(closes) < 40:
        return {"symbol": symbol, "forecast": {"actual": [], "predicted": []}}

    # Use a simple linear-fit prediction line spanning the same dates
    n = len(closes)
    x = list(range(n))
    mean_x = sum(x) / n
    mean_y = sum(closes) / n
    num = sum((x[i] - mean_x) * (closes[i] - mean_y) for i in range(n))
    den = sum((x[i] - mean_x) ** 2 for i in range(n))
    slope = num / den if den else 0
    intercept = mean_y - slope * mean_x

    predicted = [round(intercept + slope * i, 2) for i in x]

    # Future 30 days
    future = []
    last_price = closes[-1]
    for i in range(1, 31):
        future.append({
            "date": f"+{i}d",
            "price": round(last_price + slope * i, 2),
        })

    trend = "bullish" if slope > 0 else "bearish"

    return {
        "symbol": symbol,
        "forecast": {
            "trend": trend,
            "confidence": 0.72,
            "dates": dates,
            "actual": closes,
            "predicted": predicted,
            "future": future,
        },
    }

@app.get("/api/insights/{symbol}")
def ai_insights(symbol: str):
    import os, requests, statistics

    stock = get_stock_data(symbol)
    ts = stock.get("Time Series (Daily)", {})
    if not ts:
        return {"symbol": symbol, "report": "No data available."}

    prices = [float(v["4. close"]) for v in ts.values()]
    latest = prices[0]
    prev = prices[min(30, len(prices) - 1)]
    change_30d = ((latest - prev) / prev) * 100

    returns = [(prices[i] - prices[i+1]) / prices[i+1] for i in range(len(prices)-1)]
    volatility = statistics.pstdev(returns) if len(returns) > 1 else 0
    risk_score = min(100, int(volatility * 1000))
    risk_level = "Low" if risk_score < 35 else "Moderate" if risk_score < 70 else "High"

    mean = sum(prices) / len(prices)
    std = (sum((p - mean) ** 2 for p in prices) / len(prices)) ** 0.5
    anomalies = sum(1 for p in prices if std and abs((p - mean) / std) > 2)
    anomaly_rate = round(anomalies / len(prices), 4)

    # Sentiment from news
    news = get_news_sentiment(symbol)
    headlines = [a.get("title", "") for a in news.get("articles", [])[:10]]

    prompt = f"""You are a financial analyst. Analyze {symbol} using this data:

- Current price: ${latest:.2f}
- 30-day change: {change_30d:+.2f}%
- Volatility: {volatility:.4f}
- Risk score: {risk_score}/100 ({risk_level})
- Anomaly rate: {anomaly_rate}
- Sample size: {len(prices)} days
- Headlines: {headlines}

Generate a structured markdown report with EXACTLY these 7 sections (use ## headings):

## 1. Overall Financial Situation
## 2. Financial Ratio Insights
## 3. Risk Analysis
## 4. News Sentiment
## 5. Forecast Analysis
## 6. Explainable AI Findings
## 7. Overall Summary

Rules:
- Start with a single line: 'AI-generated analysis. This is not financial advice.'
- Use bullet points with bold labels.
- Keep each section to 2-4 short sentences or bullets.
- End with: 'Bottom line: ...'
- No code fences. Plain markdown only."""

    try:
        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo"),
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=60,
        )
        text = r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        text = f"AI insights unavailable: {e}"

    return {
        "symbol": symbol,
        "price": latest,
        "change_30d": round(change_30d, 2),
        "report": text,
    }
class EmailRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str

@app.post("/verify-email")
def verify_email(req: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    return {"message": "Email verified"}

@app.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    user.hashed_password = auth.get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password updated successfully"}