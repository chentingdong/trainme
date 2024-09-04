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
ACCESS_TOKEN = '241ffec49e8b18bda5190fad7eb36ab28071f6b2'

url = 'https://www.strava.com/api/v3/activities/{id}/laps'

def fetch_strava_laps(activity_id) -> list:
    """_summary_
    fetch strava laps from the API for a given activity id
    """

    logging.info("Fetching laps for activity %s", activity_id);
    response = requests.get(url.format(id=activity_id),
        headers={'Authorization': f'Bearer {ACCESS_TOKEN}'},
        timeout=60
    )

    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return []

    return response.json()


def sync_all_strava_laps():
    """_summary_
    fetch all laps from strava.
    """

    try:
        # get all activities from the database
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id 
            FROM activities a
            WHERE NOT EXISTS (
                SELECT 1 
                FROM laps l 
                WHERE (l.activity->>'id')::text = a.id::text
            )
        ''')
        result = cursor.fetchall()
        activity_ids = [int(row[0]) for row in result]
        cursor.close()

        logging.info("Found %s activities without laps", len(activity_ids))
        
        for activity_id in activity_ids:
            fetched_laps = fetch_strava_laps(activity_id)
            if not fetched_laps or len(fetched_laps) == 0:
                continue
            save_laps_to_postgres(fetched_laps)
            time.sleep(1)
    except KeyboardInterrupt:
        logging.info("Process interrupted by user. Exiting gracefully...")
    finally:
        logging.info("Fetched laps for %s activities from Strava, date.", len(activity_ids))
        
if __name__ == '__main__':
    sync_all_strava_laps()