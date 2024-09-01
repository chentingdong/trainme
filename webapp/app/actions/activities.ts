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
};

// activities from garmin. placeholder for now
export async function getActivitiesFromGarmin(): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb('GarminData/garmin.db');
  const activities: Activity[] = await db.all('SELECT * FROM files_view');
  return activities;
}

export async function getActivitiesFromStrava(): Promise<Activity[]> {
  const client = await pool.connect();
  const query = 'SELECT * FROM activities';
  const res = await client.query(query);
  client.release();
  return res.rows as Activity[];
}

// one activity from strava.
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
// export async function getActivityFromStravaByDate(date: Date): Promise<Activity[]> {
//   const db: SQLiteDatabase = await openDb('StravaData/strava_activities.db');

//   const formattedDate = date.toISOString().split('T')[0]; // Format the date as 'YYYY-MM-DD'

//   const sql = ` SELECT * FROM activities WHERE DATE(start_date) = ? `;

//   const activities: Activity[] = await db.all(sql, formattedDate);

//   if (!activities) {
//     throw new Error('Activity not found');
//   }
//   return activities;