"use server";

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
export async function saveActivities(activities: Activity[]): Promise<void> {
  try {
    for (const activity of activities) {
      const existingActivity = await db.activity.findFirst({
        where: { id: activity.id },
      });

      if (!existingActivity) {
        await db.activity.create({
          data: activity as unknown as Prisma.ActivityCreateInput,
        });
      } else {
        await db.activity.update({
          where: { id: existingActivity.id },
          data: activity as Prisma.ActivityUpdateInput,
        });
      }
    }
  } catch (err) {
    throw new Error("Error saving activities to database" + err);
  } finally {
    await db.$disconnect();
  }
}

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

    const user = await db.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const response = await axios.get(url.href, {
      headers: {
        Authorization: `Bearer ${user.stravaAccessToken}`,
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
