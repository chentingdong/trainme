'use server';

import { openDb, SQLiteDatabase } from '@/app/lib/garmin_db';
import { pool } from '@/app/actions/postgres';

export type Activity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  type: string;
  start_date_local: Date;
  map?: {
    center: {
      lat: number;
      lon: number;
    };
    summary_polyline: string;
  };
};

// activities from garmin. placeholder for now
export async function getActivitiesFromGarmin(): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb('GarminData/garmin.db');
  const activities: Activity[] = await db.all('SELECT * FROM files_view');
  return activities;
}

// get activities from strava with pagination.
export async function getActivitiesFromStrava(page = 1, perPage = 10): Promise<Activity[]> {
  const client = await pool.connect();
  const query = 'SELECT * FROM activities limit $1 offset $2';
  const res = await client.query(query, [perPage, (page - 1) * perPage]);
  client.release();
  return res.rows as Activity[];
}

// get all activities from strava on one day.
export async function getActivityFromStravaByDate(date: Date): Promise<Activity[]> {
  try {
    const client = await pool.connect();
    const fields = ['id', 'name', 'distance', 'moving_time', 'total_elevation_gain', 'type', 'start_date_local'];
    const query = `SELECT ${fields.join(', ')} FROM activities WHERE DATE(start_date_local) = $1 limit 100`;
    const formattedDate = date.toISOString().split('T')[0];
    const res = await client.query(query, [formattedDate]);
    client.release();
    return res.rows as Activity[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// get activity from strava by id.
export async function getActivityFromStravaById(id: number): Promise<Activity | null> {
  try {
    const client = await pool.connect();
    const fields = [
      'id', 'name', 'distance', 'moving_time', 'total_elevation_gain', 'type', 'start_date_local',
      'map', 'average_speed', 'max_speed', 'average_heartrate', 'max_heartrate', 'average_cadence',
    ];
    const query = `SELECT ${fields.join(', ')} FROM activities WHERE id = $1 limit 1`;
    const res = await client.query(query, [id]);
    client.release();
    return res.rows[0] as Activity;
  } catch (err) {
    console.error(err);
    return null;
  }
}