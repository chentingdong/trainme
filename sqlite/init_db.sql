DROP TABLE IF EXISTS activities;

CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    name TEXT,
    distance REAL,
    moving_time INTEGER,
    total_elevation_gain REAL,
    type TEXT,
    start_date TEXT
);