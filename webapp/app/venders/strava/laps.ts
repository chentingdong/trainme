"use server";

import { auth } from '@clerk/nextjs/server';
import { db, Prisma } from '@trainme/db';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


export type StravaLap = {
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

export async function fetchActivityLaps({
  activityId,
  persist = true,
}: {
  activityId: number,
  persist: boolean,
}): Promise<StravaLap[]> {
  // Get refresh token from cookies
  const url = new URL(
    `https://www.strava.com/api/v3/activities/${activityId}/laps`,
  );

  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const accessToken = user.stravaAccessToken;

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

export async function saveLaps(laps: StravaLap[]): Promise<void> {
  try {
    for (const lap of laps) {
      const lapData = {
        ...lap,
        uuid: uuidv4(),
        activityId: lap.activity.id,
        startDateLocal: lap.startDateLocal.toISOString(),
      };
      await db.lap.upsert({
        where: { id: lap.id } as Prisma.LapWhereUniqueInput,
        update: {},
        create: lapData,
      });
    }
  } catch (err) {
    console.error(err);
  }
}
