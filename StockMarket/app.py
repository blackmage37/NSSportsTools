from flask import Flask, jsonify, render_template_string
import json
import datetime
import random

app = Flask(__name__)


def get_live_price(company, ticker):
    now = datetime.datetime.now()

    # define market hours (e.g., 9:00 AM to 5:00 PM)
    market_open = now.replace(hour=9, minute=0, second=0, microsecond=0)
    market_close = now.replace(hour=17, minute=0, second=0, microsecond=0)

    prev_close = company['prev_close']
    target_close = company['target_close']

    if now < market_open:
        return prev_close       # market hasn't opened yet
    if now > market_close:
        return target_close     # market is closed, locked at target price

    # if the market is open, calculate where we are in the trading day (0.0 to 1.0)
    total_seconds = (market_close - market_open).total_seconds()
    elapsed_seconds = (now - market_open).total_seconds()
    progress = elapsed_seconds / total_seconds

    # base linear progression toward the target price
    expected_mid_price = prev_close + (target_close - prev_close) * progress

    # seed a pseudo-random generator with the ticker and the exact second
    # so every user looking at the site at this moment sees the exact same wiggles
    random.seed(hash(ticker) + now.hour + now.minute + now.second)
    wiggle = expected_mid_price * company['volatility'] * random.uniform(-0.01, 0.01)

    return round(expected_mid_price + wiggle, 2)


@app.route('/api/market')
def market_api():
    with open('companies.json', 'r') as f:
        companies = json.load(f)

    live_data = {}
    for ticker, data in companies.items():
        live_price = get_live_price(data, ticker)
        live_data[ticker] = {
            "name": data["name"],
            "sector": data["sector"],
            "price": live_price,
            "change_pct": round(((live_price - data["prev_close"]) / data["prev_close"]) * 100, 2)
        }
    return jsonify(live_data)


@app.route('/')
def home():
    # dashboard refreshed via javascript
    html_template = """
    <!DOCTYPE html>
    <html>
    <head><title>Koroa City Stock Exchange</title></head>
    <body style="font-family:sans-serif; background:#121212; color:white; padding:40px;">
        <h1>Koroa City Stock Exchange</h1>
        <div id="tickers">Loading live trading data...</div>

        <script>
            async function fetchMarket() {
                const res = await fetch('/api/market');
                const data = await res.json();
                let html = '';
                for(let t in data) {
                    let color = data[t].change_pct >= 0 ? '#00ff88' : '#ff3333';
                    html += `<div style="background:#1e1e1e; padding:20px; margin-bottom:10px; border-radius:5px;">
                                <h2>${data[t].name} (${t})</h2>
                                <p>Sector: ${data[t].sector}</p>
                                <p style="font-size:24px; font-weight:bold; color:${color}">
                                    $${data[t].price} (${data[t].change_pct}%)
                                </p>
                             </div>`;
                }
                document.getElementById('tickers').innerHTML = html;
            }
            setInterval(fetchMarket, 2000); // Refresh visual prices every 2 seconds
            fetchMarket();
        </script>
    </body>
    </html>
    """
    return render_template_string(html_template)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)