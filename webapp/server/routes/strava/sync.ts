import { exchangeAccessToken } from '@/server/routes/strava/syncAccessToken';
import { protectedProcedure } from '@/server/trpc';
import type { Activity } from "@trainme/db";
import { db } from "@trainme/db";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { endOfDay, subDays } from 'date-fns';

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

// data sync from strava
export async function fetchStravaActivities(userId: string, fromDate: Date, toDate: Date): Promise<Activity[]> {
  try {
    // Fetch activities list data from Strava, it only has partial data
    const urlActivities = new URL("https://www.strava.com/api/v3/athlete/activities");
    urlActivities.search = new URLSearchParams({
      before: Math.floor(toDate.getTime() / 1000).toString(),
      after: Math.floor(fromDate.getTime() / 1000).toString(),
      per_page: "200",
    }).toString();
    const accessToken = await exchangeAccessToken(userId);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const { data: partialData, status } = await axios.get(urlActivities.href, { headers });

    if (status !== 200) {
      throw new Error(`Error fetching activities from Strava: ${status}`);
    }

    // Save activities to postgres 
    const newActivities: Activity[] = [];

    if (partialData.length > 0) {
      for (const partialActivity of partialData) {
        const urlActivitesDetails = new URL(`https://www.strava.com/api/v3/activities/${partialActivity.id}`);
        // eslint-disable-next-line prefer-const
        let { data, status } = await axios.get(urlActivitesDetails.href, { headers });

        if (status === 429) {
          throw new Error("Rate limit reached. Please try again later.");
        }

        const activityData = {
          id: data.id,
          resourceState: data.resource_state,
          externalId: data.external_id ?? null,
          uploadId: data.upload_id ?? null,
          athleteId: data.athlete.id,
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
          calories: data.calories,
          averageCadence: data.average_cadence,
          averageHeartrate: data.average_heartrate,
          averageTemp: data.average_temp,
          uuid: uuidv4(),
        };

        await db.$transaction(async (tx) => {
          await tx.activity.upsert({
            where: { id: activityData.id },
            update: activityData,
            create: activityData,
          });

          if (data.laps) {
            for (const lap of data.laps) {
              const lapData = {
                id: lap.id,
                activityId: activityData.id,
                athlete: lap.athlete,
                activity: lap.activity,
                averageCadence: lap.average_cadence,
                averageHeartrate: lap.average_heartrate,
                averageSpeed: lap.average_speed,
                averageWatts: lap.average_watts,
                deviceWatts: lap.device_watts,
                distance: lap.distance,
                elapsedTime: lap.elapsed_time,
                lapIndex: lap.lap_index,
                maxHeartrate: lap.max_heartrate,
                maxSpeed: lap.max_speed,
                movingTime: lap.moving_time,
                startDate: lap.start_date,
                startDateLocal: lap.start_date_local,
                startIndex: lap.start_index,
                totalElevationGain: lap.total_elevation_gain,
              };
              await tx.lap.upsert({
                where: { id: lapData.id },
                update: lapData,
                create: lapData,
              });
            }
          }

          newActivities.push(activityData as Activity);
        });
      }
    }

    return newActivities;
  } catch (err) {
    console.error("Error fetching activities from Strava", { cause: err });
    throw new Error("Error fetching activities from Strava", { cause: err });
  }
}

export const sync = protectedProcedure
  .input(z.object({
    fromDaysAgo: z.number().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    let activities: Activity[] = [];
    let fromDate: Date;
    let toDate: Date;
    const { fromDaysAgo } = input;
    if (!fromDaysAgo) {
      fromDate = await findLastActivityDate();
      toDate = endOfDay(new Date());
      activities = await fetchStravaActivities(ctx.userId, fromDate, toDate);
    } else if (fromDaysAgo === 0) {
      throw new Error("full sync not implemented yet");
    } else {
      fromDate = subDays(endOfDay(new Date()), fromDaysAgo);
      toDate = endOfDay(new Date());
      activities = await fetchStravaActivities(ctx.userId, fromDate, toDate);
    }
    return activities;
  });

