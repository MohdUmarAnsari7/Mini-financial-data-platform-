import yfinance as yf
import pandas as pd
from fastapi import FastAPI
from functools import lru_cache
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
companies = ["AAPL", "MSFT", "GOOGL", "INFY"]

@app.get("/companies")
def get_companies():
    return {
        "companies": companies
    }

@app.get("/stock_data/{symbol}")
def get_stock(symbol: str, days: int = 30):
    df = cached_stock_data(symbol)

    if df.empty:
        return {"error": "No data found."}

    df = df.tail(days)

    return {
        "symbol": symbol,
        "data": df.to_dict(orient='records')
    }

@app.get("/summary/{symbol}")
def get_summary(symbol: str):
    df = cached_stock_data(symbol)

    if df.empty:
        return {"error": "Invalid Symbol."}
    
    return {
        "52_week_high": float(df['52_week_high'].max()),
        "52_week_low": float(df['52_week_low'].min()),
        "average_close": float(df['Close'].mean())
    }

@app.get("/compare")
def compare_stocks(stock1: str, stock2: str):
    try:
        correlation = get_correlation(stock1, stock2)
        return {
            "stock1": stock1,
            "stock2": stock2,
            "correlation": float(correlation)
            }
    except Exception as e:
        return {"error": str(e)}

@lru_cache(maxsize=10)
def cached_stock_data(symbol):
    return get_stock_data(symbol)

@app.get("/top-movers")
def top_movers():
    results = []

    for stock in companies:
        df = get_stock_data(stock)

        if df.empty:
            continue

        latest = df.iloc[-1]

        results.append({
            "symbol": stock,
            "daily_return": float(latest["Daily Return"])
        })

    if not results:
        return {"error": "No data available"}

    # sort by return
    sorted_data = sorted(results, key=lambda x: x["daily_return"], reverse=True)

    return {
        "top_gainer": sorted_data[0],
        "top_loser": sorted_data[-1]
    }

@app.get("/predict/{symbol}")
def predict(symbol: str):
    try:
        df = cached_stock_data(symbol)

        if df.empty:
            return {"error": "Invalid Symbol."}

        predictions = get_prediction(df)

        return {
            "symbol": symbol,
            "predictions": predictions
        }
    except Exception as e:
        return {"error": str(e)}

def get_stock_data(symbol, period='1y'):
    df = yf.download(symbol, period=period, interval="1d")

    if df.empty:
        print("Retrying fetch...")
        df = yf.download(symbol, period=period, interval="1d")

    if df.empty:
        return df

    df.reset_index(inplace=True)

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df['Date'] = pd.to_datetime(df['Date'])

    df['Daily Return'] = (df['Close'] - df['Open']) / df['Open']
    df['MA_7'] = df['Close'].rolling(window=7).mean()

    df['52_week_high'] = df['Close'].rolling(window=252).max()
    df['52_week_low'] = df['Close'].rolling(window=252).min()

    df['Volatility'] = df['Daily Return'].rolling(window=7).std()

    df['Sentiment Score'] = (df['Close'] - df['MA_7']) / df['MA_7']

    df.fillna(0, inplace=True)

    return df

def get_correlation(stock1, stock2):
    df1 = yf.download(stock1, period="1y")
    df2 = yf.download(stock2, period="1y")

    df = pd.DataFrame()
    df['S1'] = df1['Close']
    df['S2'] = df2['Close']

    df.dropna(inplace=True)

    df['S1_return'] = df['S1'].pct_change()
    df['S2_return'] = df['S2'].pct_change()

    return df['S1_return'].corr(df['S2_return'])

def get_prediction(df,days_ahead=7):
    print("Prediction function called")
    from sklearn.linear_model import LinearRegression
    import numpy as np
    df = df.copy()
    
    df['index'] = np.arange(len(df))
    x = df[['index']]
    y = df['Close']

    model = LinearRegression()
    model.fit(x,y)
    future_idx = np.arange(len(df), len(df) + days_ahead).reshape(-1, 1)
    predictions = model.predict(future_idx)
    return predictions.tolist()