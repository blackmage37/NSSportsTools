import requests
import json
import xml.etree.ElementTree as ET
from config import CONFIG

# get global variables from config
NATION = CONFIG["nation"]
MARKET_NAME = CONFIG["market_name"]
CONTACT = CONFIG["contact"]

# NationStates API requires a clear User-Agent header with contact info
HEADERS = {"User-Agent": f"{MARKET_NAME} - Currently running as {NATION} (Contact: {CONTACT})."}

def update_market():
    # load companies from JSON
    with open('companies.json', 'r') as f:
        companies = json.load(f)

    # fetch nationStates happenings
    url = f"https://www.nationstates.net/cgi-bin/api.cgi?nation={NATION}&q=happenings"
    response = requests.get(url, headers=HEADERS)

    # keyword tracking for today
    today_text = ""
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        for event in root.findall('.//EVENT/TEXT'):
            today_text += " " + event.text.lower()

    # calculate today's trajectory for each company
    for ticker, data in companies.items():
        macro_modifier = 0.0  # percentage shift based on news

        # scan for positive triggers
        for kw in data['keywords']['positive']:
            if kw in today_text:
                macro_modifier += 0.04  # +4% boost per keyword match

        # scan for negative triggers
        for kw in data['keywords']['negative']:
            if kw in today_text:
                macro_modifier -= 0.04  # -4% penalty per keyword match

        # move previous close to current price, and set the new target for tonight
        data['prev_close'] = data['current_price']
        data['target_close'] = data['current_price'] * (1 + macro_modifier)

    # save updates back to JSON
    with open('companies.json', 'w') as f:
        json.dump(companies, f, indent=4)
    print("Market macro trends updated successfully.")


if __name__ == "__main__":
    update_market()