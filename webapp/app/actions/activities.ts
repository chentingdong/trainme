'use server';

import { openDb, SQLiteDatabase } from '@/app/lib/garmin_db';

export type Activity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: Date;
};

// activities from garmin. placeholder for now
export async function getActivitiesFromGarmin(): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb('GarminData/garmin.db');
  const activities: Activity[] = await db.all('SELECT * FROM files_view');
  return activities;
}

// activities from strava.
export async function getActivitiesFromStrava(): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb('StravaData/strava_activities.db');
  const activities: Activity[] = await db.all('SELECT * FROM activities');
  return activities;
}

// one activity from strava.
export async function getActivityFromStravaByDate(date: Date): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb('StravaData/strava_activities.db');

  const formattedDate = date.toISOString().split('T')[0]; // Format the date as 'YYYY-MM-DD'

  const sql = ` SELECT * FROM activities WHERE DATE(start_date) = ? `;

  const activities: Activity[] = await db.all(sql, formattedDate);

  if (!activities) {
    throw new Error('Activity not found');
  }
  return activities;
}