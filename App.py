import yfinance as yf
import pandas as pd

def get_stock_data(symbol, period='1y'):
    df = yf.download(symbol, period=period)
    df.reset_index(inplace=True)
    df.dropna(inplace=True)
    df['Date'] = pd.to_datetime(df['Date'])
    
    df['Daily Return'] = (df['Close'] - df['Open']) / df['Open']
    
    df['MA_7'] = df['Close'].rolling(window=7).mean()
    
    df['52_Week_high'] = df['Close'].rolling(window=252).max()
    df['52_Week_low'] = df['Close'].rolling(window=252).min()
    
    df['Volatility'] = df['Daily Return'].rolling(window=7).std()
    
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

print(get_stock_data("INFY.NS").tail())