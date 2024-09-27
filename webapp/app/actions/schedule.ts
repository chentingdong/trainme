"use server";

import { prisma } from "@/prisma";
import type { workout_schedule as ScheduledWorkout } from "@prisma/client";

export const getScheduledWorkoutsByDate = async (
  date: Date,
): Promise<ScheduledWorkout[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const scheduledWorkouts = await prisma.workout_schedule.findMany({
      where: {
        schedule_date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        workout: true,
        activity: true,
      },
    });
    return scheduledWorkouts;
  } catch (error) {
    console.error("Error fetching scheduled workouts:", error);
    throw new Error("Failed to fetch scheduled workouts");
  }
};

export const deleteScheduledWorkoutById = async (id: string) => {
  try {
    await prisma.workout_schedule.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting scheduled workout:", error);
    throw new Error("Failed to delete scheduled workout");
  }
};
