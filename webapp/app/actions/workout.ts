"use server";

import { db } from "@/prisma";
import type {
  workout_schedule as WorkoutDate,
  workout as Workout,
} from "@trainme/db";
import { v4 as uuidv4 } from "uuid";

export async function getWorkouts(): Promise<Workout[]> {
  const workouts = await db.workout.findMany({});
  return workouts;
}

export async function getWorkoutById(id: string): Promise<Workout> {
  const workout = await db.workout.findUnique({
    where: {
      id,
    },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }
  return workout;
}

export async function saveWorkout(workout: Workout): Promise<Workout | null> {
  try {
    const oldWorkout = await db.workout.findFirst({
      where: {
        OR: [{ id: workout.id }, { name: workout.name }],
      },
    });

    const newWorkout = oldWorkout
      ? updateWorkout(oldWorkout, workout)
      : createWorkout(workout);
    return newWorkout;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save workout" + error);
  }
}

export async function createWorkout(workout: Workout): Promise<Workout | null> {
  const newWorkout = await db.workout.create({
    data: {
      ...workout,
      id: uuidv4(),
      steps: workout.steps ?? [],
    },
  });
  return newWorkout;
}

export async function updateWorkout(
  oldWorkout: Workout,
  workout: Workout,
): Promise<Workout | null> {
  const updatedWorkout = await db.workout.update({
    where: {
      id: oldWorkout.id,
    },
    data: {
      ...workout,
      id: oldWorkout.id,
      steps: workout.steps ?? undefined,
    },
  });
  return updatedWorkout;
}

export async function addToCalendar(
  workoutId: string,
  date: Date | null,
): Promise<WorkoutDate | null> {
  if (!date) return null;
  try {
    const schedule = await db.workout_schedule.create({
      data: {
        id: uuidv4(), // added id field
        workout_id: workoutId,
        schedule_date: date,
      },
    });

    return schedule;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create workout" + error);
  }
}
