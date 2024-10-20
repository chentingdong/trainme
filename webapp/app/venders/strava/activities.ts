"use server";

import { auth } from '@clerk/nextjs/server';
import type { Activity } from "@trainme/db";
import { db } from "@trainme/db";
import axios from 'axios';

// last activity date synced from strava
export async function findLastActivityDate(): Promise<Date> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    const lastActivity = await db.activity.findFirst({
      orderBy: {
        startDateLocal: "desc",
      },
    });

    return lastActivity?.startDateLocal
      ? new Date(lastActivity.startDateLocal)
      : yesterday;
  } catch (err) {
    console.error(err);
    return yesterday;
  }
}

export async function fetchLatestActivitiesFromStrava({
  persist = true,
}: {
  persist: boolean,
}): Promise<Activity[]> {
  try {
    // Fetch activities from Strava.
    const fromDate = new Date(await findLastActivityDate());

    const urlActivities = new URL("https://www.strava.com/api/v3/athlete/activities");
    urlActivities.search = new URLSearchParams({
      after: Math.floor(fromDate.getTime() / 1000).toString(),
      per_page: "200",
    }).toString();
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const { stravaAccessToken } = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { stravaAccessToken: true },
    });

    const headers = {
      Authorization: `Bearer ${stravaAccessToken}`,
    };

    const { data: partialData } = await axios.get(urlActivities.href, { headers });

    // Save activities to postgres if persist is true
    if (persist && partialData.length > 0) {
      for (const partialActivity of partialData) {
        const urlActivitesOne = new URL(`https://www.strava.com/api/v3/activities/${partialActivity.id}`);
        const { data } = await axios.get(urlActivitesOne.href, { headers });

        console.log("upserting activity", data);
        const activity = {
          id: data.id,
          resourceState: data.resource_state,
          externalId: data.external_id ?? null,
          uploadId: data.upload_id ?? null,
          athlete: {
            connect: { id: data.athlete.id },
          },
          name: data.name,
          distance: data.distance,
          movingTime: data.moving_time,
          elapsedTime: data.elapsed_time,
          totalElevationGain: data.total_elevation_gain,
          type: data.type,
          sportType: data.sport_type,
          startDate: data.start_date,
          startDateLocal: data.start_date_local,
          timezone: data.timezone,
          utcOffset: data.utc_offset,
          achievementCount: data.achievement_count,
          kudosCount: data.kudos_count,
          commentCount: data.comment_count,
          athleteCount: data.athlete_count,
          photoCount: data.photo_count,
          mapField: data.map,
          trainer: data.trainer,
          commute: data.commute,
          manual: data.manual,
          private: data.private,
          flagged: data.flagged,
          gearId: data.gear_id ?? null,
          fromAcceptedTag: data.from_accepted_tag ?? null,
          averageSpeed: data.average_speed,
          maxSpeed: data.max_speed,
          deviceWatts: data.device_watts,
          hasHeartrate: data.has_heartrate,
          prCount: data.pr_count,
          totalPhotoCount: data.total_photo_count,
          hasKudoed: data.has_kudoed,
          workoutType: data.workout_type ?? null,
          description: data.description ?? "",
          calories: data.calories
        };

        await db.activity.upsert({
          where: { id: activity.id },
          update: activity,
          create: activity,
        });
      }
    }

    return partialData as Activity[];
  } catch (err) {
    console.error("Error fetching activities from Strava", { cause: err });
    throw new Error("Error fetching activities from Strava", { cause: err });
  }
}
