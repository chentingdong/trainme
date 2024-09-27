"use server";

import { cookies } from "next/headers";
import { getStravaAccessToken } from "@/utils/strava";
import axios from "axios";
import { type activity as Activity } from "@prisma/client";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

// get activities from strava with pagination.
export async function getActivities(
  fromDate: Date,
  toDate: Date,
): Promise<Activity[]> {
  const activities = await prisma.activity.findMany({
    where: {
      start_date_local: {
        gte: fromDate.toISOString(),
        lte: toDate.toISOString(),
      },
    },
  });
  return activities;
}

// get all activities from strava on one day.
export async function getActivitiesByDate(date: Date): Promise<Activity[]> {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        start_date_local: {
          gte: date.toISOString(),
          lt: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    });
    return activities;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// get activity from strava by id.
export async function getActivityById(id: number): Promise<Activity | null> {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: id,
      },
    });
    return activity;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// sync activities from strava to postgres
export async function fetchLatestActivitiesFromStrava(
  persist: boolean = false,
): Promise<Activity[]> {
  // Get refresh token from cookies
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("strava_refresh_token")?.value;

  // Get temporary access token from Strava
  const accessToken = await getStravaAccessToken(refreshToken);

  try {
    // Fetch activities from Strava.
    const fromDate = new Date(await findLastActivityDate());
    const url = new URL("https://www.strava.com/api/v3/athlete/activities");
    url.search = new URLSearchParams({
      after: Math.floor(fromDate.getTime() / 1000).toString(),
      per_page: "200",
    }).toString();

    const response = await axios.get(url.href, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const activities: Activity[] = response.data;

    // Save activities to postgres if persist is true
    if (persist && activities.length > 0) {
      await saveActivities(activities);
    }

    return activities;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching activities from Strava");
  }
}

export async function findLastActivityDate(): Promise<Date> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    const lastActivity = await prisma.activity.findFirst({
      orderBy: {
        start_date_local: "desc",
      },
    });

    return lastActivity?.start_date_local
      ? new Date(lastActivity.start_date_local)
      : yesterday;
  } catch (err) {
    console.error(err);
    return yesterday;
  }
}

// save activities to postgres.
// For now we assume we sync often, activities count < 200, the strava api limit.
export async function saveActivities(activities: Activity[]): Promise<void> {
  try {
    for (const activity of activities) {
      const existingActivity = await prisma.activity.findFirst({
        where: { id: activity.id },
      });

      if (!existingActivity) {
        await prisma.activity.create({
          data: activity as Prisma.activityCreateInput,
        });
      } else {
        await prisma.activity.update({
          where: { id: existingActivity.id },
          data: activity as Prisma.activityCreateInput,
        });
      }
    }
  } catch (err) {
    console.error("Error during upsert:", err);
    throw new Error("Error saving activities to database" + err);
  } finally {
    await prisma.$disconnect();
  }
}
