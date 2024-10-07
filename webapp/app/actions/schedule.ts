// "use server";

// import { db } from "@trainme/db";
// import type { workout_schedule as ScheduledWorkout } from "@trainme/db";

// export const getScheduledWorkoutsByDate = async (
//   date: Date,
// ): Promise<ScheduledWorkout[]> => {
//   const startOfDay = new Date(date);
//   startOfDay.setHours(0, 0, 0, 0);
//   const endOfDay = new Date(date);
//   endOfDay.setHours(23, 59, 59, 999);

//   try {
//     const scheduledWorkouts = await db.workout_schedule.findMany({
//       where: {
//         schedule_date: {
//           gte: startOfDay,
//           lt: endOfDay,
//         },
//       },
//       include: {
//         workout: true,
//         activity: true,
//       },
//     });
//     return scheduledWorkouts;
//   } catch (error) {
//     console.error("Error fetching scheduled workouts:", error);
//     throw "Failed to fetch scheduled workouts";
//   }
// };

// export const deleteScheduledWorkoutById = async (id: string) => {
//   try {
//     await db.workout_schedule.delete({
//       where: {
//         id,
//       },
//     });
//     return true;
//   } catch (error) {
//     console.error("Error deleting scheduled workout:", error);
//     throw "Failed to delete scheduled workout";
//   }
// };
