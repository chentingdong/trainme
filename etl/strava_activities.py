# Download all strava activities. Only need to successfully run it once.
# Idenpodent operation.

import os
import logging
import requests
from etl.db import save_activities_to_postgres
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# get the client_id and client_secret from the environment variables
client_id = os.getenv('STRAVA_CLIENT_ID')
client_secret = os.getenv('STRAVA_CLIENT_SECRET')

# Temporary access token taken from browser session storage. 
ACCESS_TOKEN = 'f9e3911b3f91d49552c45bb68053c6a70845eaca'

url = 'https://www.strava.com/api/v3/athlete/activities'

def fetch_strava_activities(page=1, per_page=200) -> list:
    """_summary_
    fetch strava activities from the API one page at a time
    """

    logging.info("Fetching activities, page %s x %s per page", page, per_page);
    response = requests.get(url,
        headers={'Authorization': f'Bearer {ACCESS_TOKEN}'},
        params={'page': page, 'per_page': per_page},
        timeout=60
    )

    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return []

    return response.json()

def sync_all_strava_activities():
    """_summary_
    fetch all activities from strava.
    Maximum allowed by Strava API is per_page=200
    """
    page = 1
    per_page = 200
    count = 0
    
    try:
        while True:
            fetched_activities = fetch_strava_activities(page, per_page)
            if not fetched_activities or len(fetched_activities) == 0:
                break
            save_activities_to_postgres(fetched_activities)
            count += len(fetched_activities)
            page += 1
            break; #temp
    except KeyboardInterrupt:
        logging.info("Process interrupted by user. Exiting gracefully...")
    finally:
        logging.info("Fetched %s activities from Strava.", count)

if __name__ == '__main__':
    sync_all_strava_activities()