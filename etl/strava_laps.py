# Download all strava activity laps. Only need to successfully run it once.
# Idenpodent operation.

import os
import logging
import requests
import time
from etl.db import save_laps_to_postgres, conn
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# get the client_id and client_secret from the environment variables
client_id = os.getenv('STRAVA_CLIENT_ID')
client_secret = os.getenv('STRAVA_CLIENT_SECRET')

# Temporary access token taken from browser session storage.
# TODO: automate this in the backend too. use fresh token to get access token.
ACCESS_TOKEN = 'REPLACE_THIS'

url = 'https://www.strava.com/api/v3/activities/{id}/laps'


def fetch_strava_laps(activity_id) -> list:
    """Fetch strava laps from the API for a given activity id."""
    max_retries = 5
    retry_delay = 60  # Initial delay in seconds

    for _ in range(max_retries):
        response = requests.get(url.format(id=activity_id),
            headers={'Authorization': f'Bearer {ACCESS_TOKEN}'},
            timeout=60
        )

        if response.status_code == 200:
            return response.json()
        elif response.status_code == 429:
            logging.warning("Rate limit exceeded, retrying in %s seconds...", retry_delay)
            time.sleep(retry_delay)
            retry_delay *= 2  # Exponential backoff
        elif response.status_code == 401:
            logging.error("Failed Authorization. Exit.")
            exit()
        else:
            logging.error("Error: %s - %s", response.status_code, response.text)
            return []

    logging.error("Failed to fetch laps for activity %s after %s attempts.", activity_id, max_retries)
    return []

def sync_all_strava_laps():
    """_summary_
    fetch all laps from strava.
    """

    try:
        # get all activities from the database
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, start_date_local
            FROM activities a
            WHERE NOT EXISTS (
                SELECT 1 
                FROM laps l 
                WHERE (l.activity->>'id')::text = a.id::text
            )
            ORDER BY start_date_local DESC
        ''')
        result = cursor.fetchall()
        activities = [(int(row[0]), row[1]) for row in result]
        cursor.close()

        logging.info("Found %s activities without laps", len(activities))
        
        for activity_id, start_date_local in activities:
            fetched_laps = fetch_strava_laps(activity_id)
            if not fetched_laps or len(fetched_laps) == 0:
                continue
            logging.info("Fetching laps for activity %s with start time %s, found %s laps", activity_id, start_date_local, len(fetched_laps))
            save_laps_to_postgres(fetched_laps)
    except KeyboardInterrupt:
        logging.info("Process interrupted by user. Exiting gracefully...")
    finally:
        logging.info("Fetched laps for %s activities from Strava, date.", len(activities))
        
if __name__ == '__main__':
    sync_all_strava_laps()