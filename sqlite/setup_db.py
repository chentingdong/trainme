import sqlite3

conn = sqlite3.connect('strava_activities.db')
cursor = conn.cursor()

cursor.execute('''
DROP TABLE IF EXISTS activities
''')

cursor.execute('''
CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    name TEXT,
    distance REAL,
    moving_time INTEGER,
    total_elevation_gain REAL,
    type TEXT,
    start_date TEXT
)
''')    

conn.commit()