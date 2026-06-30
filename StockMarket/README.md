# NationStates Stock Market Engine

[![GitHub license](https://img.shields.io/github/license/blackmage37/NSSportsTools)](https://github.com/blackmage37/NSSportsTools/tree/main/StockMarket) ![Status](https://img.shields.io/badge/Status-Beta_Testing-yellow) ![Python](https://img.shields.io/badge/Python-3.8%2B-blueviolet?logo=python) ![World](https://img.shields.io/badge/World-NationStates-blue) ![White Label Badge](https://img.shields.io/badge/Anaia-Koroa%20City-200441?labelColor=00ff89) 

A lightweight, automated Python stack that simulates a live, intra-day fictional stock market driven directly by your [NationStates](https://www.nationstates.net) nation's legislative happenings and regional events.

## How It Works

The system is split into two independent parts to remain compliant with the NationStates API rate limits:

1. **Macro Engine (`market_engine.py`):** Runs once a day via a cron job. It scrapes your nation's happenings feed, scans for custom keywords (e.g., *defense*, *farming*, *subsidy*), and calculates a target closing price for your companies based on your real gameplay choices.
2. **Live Web App (`app.py`):** A Flask web server that handles front-end requests. When a user views the dashboard, it uses pseudo-random Geometric Brownian Motion to procedurally generate live, second-by-second price wiggles between the day's opening and target closing price, mimicking a real trading floor.

---

## File Structure

```text
├── companies.json      # The "database" holding company stats and keyword triggers
├── market_engine.py    # The daily API scraper & keyword processor
├── app.py              # The Flask server & intra-day simulation engine
├── config.py           # Configuration options (see below)
└── README.md           # This documentation
```

## Local Setup & Testing

### 1. Prerequisites
Ensure you have Python 3 installed. Install the required dependencies:
```bash
pip install requests flask
```

### 2. Configuration
Open `companies.json` to add or modify your placeholder companies, their base prices, and their positive/negative keyword lists.

Then create your own version of config.py and place it in the same folder
```
CONFIG = {
    "nation": "YourNationName",
    "contact": "youremail@domain.com",
    "market_name": "Koroa City Stock Market",
    "local_refresh_rate": 5000,         # in milliseconds, how often to refresh. does NOT call the NS API
}
```
You MUST set all variables. The nation name and contact details are important for NationStates moderators to know who is running the script, if something goes wrong. The API call only happens when you run `market_engine.py`, so you should never have any issues with API rate limits. Well, unless you schedule a ridiculous cron... 

### 3. Running the App
Start the local web server:
```bash
python app.py
```
Open your browser and navigate to `http://localhost:5000`. You will see the live trading dashboard updating every 5 seconds (or however many milliseconds you set CONFIG.local_refresh_rate to)

To simulate a daily update and see the stock trajectories shift based on your NationStates logs, open a second terminal and run:
```bash
python market_engine.py
```

## Production Deployment (Linux Server)

### 1. Automating Daily API Pulls (Cron)
To fetch new legislative data automatically once a day at midnight, add a cron job on your server:
```bash
crontab -e
```

Add the following line (make sure to update the path to your folder):
```text
0 0 * * * cd /path/to/your/folder && /usr/bin/python3 market_engine.py >> market.log 2>&1
```

You can adjust this to run multiple times a day if you want, just be aware of the API rate limits.

### 2. Keeping the Web App Alive (Systemd)
Create a persistent system service to run the Flask application securely via Gunicorn.

1. Install Gunicorn: 
```bash
pip install gunicorn
```
2. Create the service file: 
```bash
sudo nano /etc/systemd/system/ns_market.service
```
3. Paste the configuration (don't forget to update the folder path!):

```ini
[Unit]
Description=NationStates Stock Market Server
After=network.target

[Service]
User=root
WorkingDirectory=/path/to/your/folder
ExecStart=/usr/local/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

4. Start and enable the service:
```bash
sudo systemctl daemon-reload
sudo systemctl start ns_market
sudo systemctl enable ns_market
```

Your market is now live in production and safe from API rate-limit bans.

## Updates

Companies can be added to or removed from the `companies.json` file at any time, and the change will be reflected at the next refresh. 

Price changes reliant on NationStates API data will not take place until `market_engine.py` runs, however.

### New companies

When adding new companies, make sure the `current_price`, `prev_close`, and `target_close` values are all exactly the same. This way, the engine will "wiggle" the price around whatever you set until the next API call overwrites relevant values.

