# 📊 mini financial data platform 

A full-stack stock analytics dashboard that provides real-time stock insights, comparison tools, and basic price predictions using machine learning.

-------------------------------------

## 🚀 Features

* 📈 Interactive stock price visualization
* 📊 Moving Average (MA 7) tracking
* 🔍 Filter data (Last 30 / 90 days)
* 🏆 Top Gainers & Top Losers insights
* 🔗 Compare two stocks in one chart
* 🤖 Price prediction using Linear Regression
* ⚡ Optimized backend using LRU Cache

-------------------------------------

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* Chart.js

### Backend

* FastAPI
* Python
* yFinance (Stock API)
* Pandas (Data Processing)
* Scikit-learn (Machine Learning)

-------------------------------------

## 📂 Project Structure

```
project-root/
│
├── app.py
├── requirements.txt
├── runtime.txt
├── Short video.mp4
|
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│
└── README.md
```

-------------------------------------

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

-------------------------------------

### 🔹 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

👉 Backend runs at:
`http://127.0.0.1:8000`

-------------------------------------

### 🔹 3. Frontend Setup

Open directly:

```
frontend/index.html
```

OR use Live Server (recommended)

-------------------------------------

## 🌐 Deployment

### Frontend

* Hosted on GitHub Pages

### Backend

* Hosted on Render

-------------------------------------

## 📡 API Endpoints

| Endpoint                     | Description                         |
| ---------------------------- | ----------------------------------- |
| `/companies`                 | Get list of available stocks        |
| `/stock_data/{symbol}`       | Fetch stock data                    |
| `/summary/{symbol}`          | Get summary (52-week high/low, avg) |
| `/compare?stock1=A&stock2=B` | Compare two stocks                  |
| `/top-movers`                | Get top gainer & loser              |
| `/predict/{symbol}`          | Get future price prediction         |

-------------------------------------

## 🤖 Prediction Model

* Uses Linear Regression
* Trained on historical closing prices
* Predicts next 7 days trend
* Designed for visualization only