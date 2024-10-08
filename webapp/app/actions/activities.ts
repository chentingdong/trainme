"use server";

import type { activity as Activity } from "@trainme/db";
import { db, Prisma } from "@trainme/db";

// last activity date synced from strava
export async function findLastActivityDate(): Promise<Date> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    const lastActivity = await db.activity.findFirst({
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
      const existingActivity = await db.activity.findFirst({
        where: { id: activity.id },
      });

      if (!existingActivity) {
        await db.activity.create({
          data: activity as Prisma.activityCreateInput,
        });
      } else {
        await db.activity.update({
          where: { id: existingActivity.id },
          data: activity as Prisma.activityCreateInput,
        });
      }
    }
  } catch (err) {
    console.error("Error during upsert:", err);
    throw new Error("Error saving activities to database" + err);
  } finally {
    await db.$disconnect();
  }
}
