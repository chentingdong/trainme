"use server";

import { trpc } from '@/app/api/trpc/client';
import { auth } from '@clerk/nextjs/server';
import type { Activity } from "@trainme/db";
import { db, Prisma } from "@trainme/db";
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

// save activities to postgres.
// For now we assume we sync often, activities count < 200, the strava api limit.
// export async function saveActivities(activities: Activity[]): Promise<void> {
//   try {
//     for (const activity of activities) {
//       const existingActivity = await db.activity.findFirst({
//         where: { id: activity.id },
//       });

//       if (!existingActivity) {
//         await db.activity.create({
//           data: activity as unknown as Prisma.ActivityCreateInput,
//         });
//       } else {
//         await db.activity.update({
//           where: { id: existingActivity.id },
//           data: activity as Prisma.ActivityUpdateInput,
//         });
//       }
//     }
//   } catch (err) {
//     throw new Error("Error saving activities to database" + err);
//   } finally {
//     await db.$disconnect();
//   }
// }

// sync activities from strava to postgres
export async function fetchLatestActivitiesFromStrava({
  persist = true,
}: {
  persist: boolean,
}): Promise<Activity[]> {
  try {
    // Fetch activities from Strava.
    const fromDate = new Date(await findLastActivityDate());

    const url = new URL("https://www.strava.com/api/v3/athlete/activities");
    url.search = new URLSearchParams({
      after: Math.floor(fromDate.getTime() / 1000).toString(),
      per_page: "200",
    }).toString();
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const { stravaAccessToken } = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { stravaAccessToken: true },
    });

    const { data } = await axios.get(url.href, {
      headers: {
        Authorization: `Bearer ${stravaAccessToken}`,
      },
    });
    // Save activities to postgres if persist is true
    if (persist && data.length > 0) {
      for (const rawActivity of data) {
        const activity = {
          id: rawActivity.id,
          resourceState: rawActivity.resource_state,
          externalId: rawActivity.external_id ?? null,
          uploadId: rawActivity.upload_id ?? null,
          athlete: {
            connect: { id: rawActivity.athlete.id },
          },
          name: rawActivity.name,
          distance: rawActivity.distance,
          movingTime: rawActivity.moving_time,
          elapsedTime: rawActivity.elapsed_time,
          totalElevationGain: rawActivity.total_elevation_gain,
          type: rawActivity.type,
          sportType: rawActivity.sport_type,
          startDate: rawActivity.start_date,
          startDateLocal: rawActivity.start_date_local,
          timezone: rawActivity.timezone,
          utcOffset: rawActivity.utc_offset,
          achievementCount: rawActivity.achievement_count,
          kudosCount: rawActivity.kudos_count,
          commentCount: rawActivity.comment_count,
          athleteCount: rawActivity.athlete_count,
          photoCount: rawActivity.photo_count,
          mapField: {
            id: rawActivity.map.id,
            polyline: rawActivity.map.polyline ?? null,
            resourceState: rawActivity.map.resource_state,
          },
          trainer: rawActivity.trainer,
          commute: rawActivity.commute,
          manual: rawActivity.manual,
          private: rawActivity.private,
          flagged: rawActivity.flagged,
          gearId: rawActivity.gear_id ?? null,
          fromAcceptedTag: rawActivity.from_accepted_tag ?? null,
          averageSpeed: rawActivity.average_speed,
          maxSpeed: rawActivity.max_speed,
          deviceWatts: rawActivity.device_watts,
          hasHeartrate: rawActivity.has_heartrate,
          prCount: rawActivity.pr_count,
          totalPhotoCount: rawActivity.total_photo_count,
          hasKudoed: rawActivity.has_kudoed,
          workoutType: rawActivity.workout_type ?? null,
          description: rawActivity.description ?? "",
          calories: rawActivity.calories,
          segmentEfforts: rawActivity.segment_efforts,
        };
        await db.activity.upsert({
          where: { id: activity.id },
          update: activity,
          create: activity,
        });
      }
    }

    return data as Activity[];
  } catch (err) {
    throw new Error("Error fetching activities from Strava", { cause: err });
  }
}
