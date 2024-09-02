'use server';

import { openDb, SQLiteDatabase } from '@/app/lib/garmin_db';
import { pool } from '@/app/actions/postgres';
import { cookies } from 'next/headers';
import strava from 'strava-v3';
import { getStravaAuthUrl } from '@/utils/strava';

export const stravaClient = (accessToken: string) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }

  strava.config({
    client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '',
    client_secret: process.env.STRAVA_CLIENT_SECRET || '',
    redirect_uri: `http://localhost:${process.env.PORT}/api/authorize`,
    access_token: accessToken
  });

  return strava;
};
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
  [key: string]: any; // Add index signature
};

// activities from garmin. placeholder for now
export async function getActivitiesFromGarmin(): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb('GarminData/garmin.db');
  const activities: Activity[] = await db.all('SELECT * FROM files_view');
  return activities;
}

// get activities from strava with pagination.
export async function getStravaActivities(fromDate: Date, toDate: Date): Promise<Activity[]> {
  const client = await pool.connect();
  const query = 'SELECT * FROM activities WHERE start_date_local >= $1 and start_date_local <= $2 ORDER BY start_date_local desc limit 150';
  const res = await client.query(query, [fromDate, toDate]);
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

// sync activities from strava to postgres
export async function fetchLatestActivities(persist: boolean): Promise<unknown[]> {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('strava_refresh_token')?.value;

  if (!refreshToken) {
    window.location.href = getStravaAuthUrl();
    return [];
  }

  const fromDate = new Date(await findLastActivityDate());
  const toDate = new Date();

  const resp = await strava.oauth.refreshToken(refreshToken);
  const accessToken = resp.access_token;

  try {
    const strava = stravaClient(accessToken);
    const activities = await strava.athlete.listActivities({
      before: Math.floor(toDate.getTime() / 1000),
      after: Math.floor(fromDate.getTime() / 1000),
      per_page: 200,
    });

    if (persist) {
      await saveActivities(activities);
    }

    return activities;
  } catch (err) {
    console.error('Error fetching activities from Strava:', err);
    return [];
  }
}

export async function findLastActivityDate(): Promise<Date> {
  try {
    const client = await pool.connect();
    const query = 'SELECT start_date_local FROM activities ORDER BY start_date_local DESC LIMIT 1';
    const res = await client.query(query);
    client.release();
    return res.rows[0]?.start_date_local;
  } catch (err) {
    console.error(err);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
}

// save activities to postgres. 
// For now we assume we sync often, activities count < 200, the strava api limit.
export async function saveActivities(activities: Activity[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fields = Object.keys(activities[0]).sort();

    for (const activity of activities) {
      // Ensure JSON fields are properly formatted and null not as 'null'
      const values = fields.map(field => {
        const value = activity[field];
        if (value === null || value === undefined) {
          return null;
        } else if (typeof value === 'object') {
          return JSON.stringify(value);
        } else {
          return value;
        }
      });

      const query = `
        INSERT INTO activities (${fields.join(', ')})
        VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
        ON CONFLICT (id) DO NOTHING
      `;
      const result = await client.query(query, values);
      console.log(activity, result);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
  } finally {
    client.release();
  }
}