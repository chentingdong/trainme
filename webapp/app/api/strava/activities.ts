"use server";

import { getStravaAccessToken } from "@/app/api/strava/authorization";
import { cookies } from "next/headers";
import axios from "axios";
import { type Activity } from "@trainme/db";
import { db } from "@trainme/db";
import { findLastActivityDate, saveActivities } from '@/app/actions/activities';

// get activities from strava with pagination.
export async function getActivities(
  fromDate: Date,
  toDate: Date,
): Promise<Activity[]> {
  const activities = await db.activity.findMany({
    where: {
      startDateLocal: {
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
    const activities = await db.activity.findMany({
      where: {
        startDateLocal: {
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
    const activity = await db.activity.findUnique({
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
  try {
    // Get refresh token from cookies
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("strava_refresh_token")?.value;

    // Get temporary access token from Strava
    const accessToken = await getStravaAccessToken(refreshToken);
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