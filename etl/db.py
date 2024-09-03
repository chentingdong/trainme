import os
import json
import logging
import psycopg2

conn = psycopg2.connect(
    dbname='trainme',
    user='postgres',
    password='docker',
    host='localhost',
    port=os.getenv('POSTGRES_PORT', 5432)
)

def save_activities_to_postgres(activities):
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

def save_laps_to_postgres(laps):
    cursor = conn.cursor()
    for lap in laps:
        try:
            # Convert lists and dicts to JSON strings
            for key, value in lap.items():
                if isinstance(value, (list, dict)):
                    lap[key] = json.dumps(value)
            
            escaped_columns = [f'"{col}"' if '.' in col else col for col in lap.keys()]
            columns = ', '.join(escaped_columns)
            placeholders = ', '.join(['%s' for _ in lap])
            update_clause = ', '.join([f'{col} = EXCLUDED.{col}' for col in lap.keys()])
            
            sql = f'''
                INSERT INTO laps ({columns}) 
                VALUES ({placeholders}) 
                ON CONFLICT (id)
                DO UPDATE SET {update_clause}
            '''
            
            cursor.execute(sql, list(lap.values()))
            conn.commit()
        except Exception as e:
            logging.error('Error: %s', e)
            conn.rollback()
            break
    cursor.close()