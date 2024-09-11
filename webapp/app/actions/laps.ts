"use server";

import { getStravaAccessToken } from '@/utils/strava';
import axios from 'axios';
import { cookies } from 'next/headers';
import { pool } from './postgres';

export type Lap = {
  id: number;
  resource_state: number;
  name: string;
  activity: {
    id: number;
    visibility?: string;
    resource_state: number;
  };
  athlete: {
    id: number;
    resource_state: number;
  };
  elapsed_time: number;
  moving_time: number;
  start_date: Date;
  start_date_local: Date;
  distance: number;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  max_cadence?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  lap_index: number;
};

export async function fetchActivityLaps(activityId: number, persist: boolean = false): Promise<Lap[]> {
  // Get refresh token from cookies
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('strava_refresh_token')?.value;

  // Get temporary access token from Strava
  const accessToken = await getStravaAccessToken(refreshToken);

  const url = new URL(`https://www.strava.com/api/v3/activities/${activityId}/laps`);
  const response = await axios.get(url.href, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const laps = response.data;
  if (persist && laps.length > 0) {
    await saveLaps(laps);
  }
  return laps;
}

export async function saveLaps(laps: Lap[]): Promise<void> {
  try {
    const client = await pool.connect();
    const fields = Object.keys(laps[0]);

    for (const lap of laps) {
      const values = Object.values(lap);
      const query = `
        INSERT INTO laps (${fields.join(', ')}) 
        VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) 
        ON CONFLICT DO NOTHING;
      `;
      await client.query(query, values);
    }
    client.release();
  } catch (err) {
    console.error(err);
  }
}


export async function getStravaActivityLaps(id: number): Promise<Lap[]> {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM laps WHERE (activity->>'id')::bigint = $1;`;
    const res = await client.query(query, [id]);
    client.release();
    return res.rows as Lap[];
  } catch (err) {
    console.error(err);
    return [];
  }
}