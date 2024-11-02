// "use server";

// import { type Activity } from "@trainme/db";
// import { db } from "@trainme/db";

// // get activities from strava with pagination.
// export async function getActivities(
//   fromDate: Date,
//   toDate: Date,
// ): Promise<Activity[]> {
//   const activities = await db.activity.findMany({
//     where: {
//       startDateLocal: {
//         gte: fromDate.toISOString(),
//         lte: toDate.toISOString(),
//       },
//     },
//   });
//   return activities;
// }

// // get all activities from strava on one day.
// export async function getActivitiesByDate(date: Date): Promise<Activity[]> {
//   try {
//     const activities = await db.activity.findMany({
//       where: {
//         startDateLocal: {
//           gte: date.toISOString(),
//           lt: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
//         },
//       },
//     });
//     return activities;
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// }


// // get activity from strava by id.
// export async function getActivityById(id: number): Promise<Activity | null> {
//   try {
//     const activity = await db.activity.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     return activity;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }
