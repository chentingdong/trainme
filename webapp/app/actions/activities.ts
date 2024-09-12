'use server';

import { openDb, SQLiteDatabase } from '@/app/lib/garmin_db';
import { pool } from '@/app/actions/postgres';
import { cookies } from 'next/headers';
import { getStravaAccessToken, getStravaAuthUrl } from '@/utils/strava';
import axios from 'axios';

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
export async function fetchLatestActivities(persist: boolean = false): Promise<Activity[]> {
  // Get refresh token from cookies
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('strava_refresh_token')?.value;

  // Get temporary access token from Strava
  const accessToken = await getStravaAccessToken(refreshToken);

  try {
  // Fetch activities from Strava.
    const fromDate = new Date(await findLastActivityDate());
    const url = new URL('https://www.strava.com/api/v3/athlete/activities');
    url.search = new URLSearchParams({
      after: Math.floor(fromDate.getTime() / 1000).toString(),
      per_page: '200'
    }).toString();

    const response = await axios.get(url.href, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const activities = response.data as Activity[];

    // Save activities to postgres if persist is true
    if (persist && activities.length > 0) {
      await saveActivities(activities);
    }

    return activities;
  } catch (err) {
    throw new Error('Error fetching activities from Strava');
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