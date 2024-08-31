import os
import json
import logging
import sqlite3
import psycopg2

def save_activities_to_sqlite(activities):
    conn = sqlite3.connect('/Users/tingdong/projects/trainme/sqlite/strava_activities.db')
    cursor = conn.cursor()

    for activity in activities:
        try:
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
        except Exception as e:
            logging.error('Error: %s', e)
            conn.rollback()
            break

    conn.close()

def save_activities_to_postgres(activities):
    conn = psycopg2.connect(
        dbname='trainme',
        user='postgres',
        password='docker',
        host='localhost',
        port=os.getenv('POSTGRES_PORT', 5432)
    )
    
    cursor = conn.cursor()
    
    for activity in activities:
        try:
            # Convert lists and dicts to JSON strings
            for key, value in activity.items():
                if isinstance(value, (list, dict)):
                    activity[key] = json.dumps(value)
            
            escaped_columns = [f'"{col}"' if '.' in col else col for col in activity.keys()]
            columns = ', '.join(escaped_columns)
            placeholders = ', '.join(['%s' for _ in activity])
            
            sql = f'''
                INSERT INTO activities ({columns}) 
                VALUES ({placeholders}) 
                ON CONFLICT (id) 
                DO NOTHING
            '''
            
            cursor.execute(sql, list(activity.values()))
            conn.commit()
        except Exception as e:
            logging.error('Error: %s', e)
            conn.rollback()
            break
        
    conn.close()
    
def flatten_dict(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def flatten_activity(activity):
    return flatten_dict(activity)