"use server";

import { pool } from "./postgres";

export type Lap = {
  id: number;
  resourceState: number;
  name: string;
  activity: {
    id: number;
    visibility?: string;
    resourceState: number;
  };
  athlete: {
    id: number;
    resourceState: number;
  };
  elapsed_time: number;
  movingTime: number;
  start_date: Date;
  startDateLocal: Date;
  distance: number;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  max_cadence?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  lap_index: number;
};

export async function saveLaps(laps: Lap[]): Promise<void> {
  try {
    const client = await pool.connect();
    const fields = Object.keys(laps[0]);
    fields.push("activityId");

    for (const lap of laps) {
      const values = Object.values(lap);
      const query = `
        INSERT INTO lap (${fields.join(", ")}, activityId)
        VALUES (${values.map((_, i) => `$${i + 1}`).join(", "), lap.activity.id})
        ON CONFLICT DO NOTHING;
      `;
      await client.query(query, values);
    }
    client.release();
  } catch (err) {
    console.error(err);
  }
}

