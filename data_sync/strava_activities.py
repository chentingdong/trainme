# download strava activities
import os
import requests
import sqlite3

client_id = os.getenv('STRAVA_CLIENT_ID')
client_secret = os.getenv('STRAVA_CLIENT_SECRET')
# update this code by visiting the following URL from browser
# https://www.strava.com/oauth/authorize?client_id=49875&response_type=code&redirect_uri=http://localhost&scope=activity:read_all&approval_prompt=force
authorization_code = 'REMOVED_SECRET'

def get_access_token():
    response = requests.post(
        url='https://www.strava.com/oauth/token',
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'response_type': 'code',
            'redirect_uri': 'http://localhost',
            'code': authorization_code,
            'scope': 'read,activity:read_all',
            'approval_prompt': 'force',
        },
        timeout=5
    )


    return response.json()['access_token']

def get_activities(access_token):
    url = 'https://www.strava.com/api/v3/athlete/activities'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get(url, headers=headers, timeout=5)
    return response.json()


def save_activities_to_db(activities):
    conn = sqlite3.connect('/Users/tingdong/projects/trainme/sqlite/strava_activities.db')
    cursor = conn.cursor()

    for activity in activities:
        cursor.execute('''
            INSERT INTO activities (id, name, distance, moving_time, type, start_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            activity['id'],
            activity['name'],
            activity['distance'],
            activity['moving_time'],
            activity['type'],
            activity['start_date']
        ))

    conn.commit()
    conn.close()
                       
    
if __name__ == '__main__':
    access_token = get_access_token()
    activities = get_activities(access_token)
    save_activities_to_db(activities)