"use server";

import { prisma } from '@/prisma';
import type { workout_schedule as WorkoutDate, workout as Workout } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export async function getWorkouts(): Promise<Workout[]> {
  const workouts = await prisma.workout.findMany({
    where: {
      deletedAt: null,
    },
  });

  return workouts;
}

export async function getWorkoutById(id: string): Promise<Workout> {
  const workout = await prisma.workout.findUnique({
    where: {
      id,
    },
  });

  if (!workout) {
    throw new Error('Workout not found');
  }
  return workout;
}

export async function saveWorkout(workout: Workout): Promise<Workout | null> {
  try {
    const oldWorkout = await prisma.workout.findFirst({
      where: {
        name: workout.name,
      }
    });

    const newWorkout = oldWorkout ? updateWorkout(oldWorkout, workout) : createWorkout(workout);
    return newWorkout;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save workout' + error);
  }
}

export async function createWorkout(workout: Workout): Promise<Workout | null> {
  const newWorkout = await prisma.workout.create({
    data: {
      ...workout,
      steps: workout.steps ?? [],
    },
  });
  return newWorkout;
}

export async function updateWorkout(oldWorkout: Workout, workout: Workout): Promise<Workout | null> {
  const updatedWorkout = await prisma.workout.update({
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

export async function addToCalendar(workout: Workout, date: Date | null): Promise<WorkoutDate | null> {
  if (!date) return null;
  try {
    const schedule = await prisma.workout_schedule.create({
      data: { 
        workout_id: workout.id,
        schedule_date: date,
        name: workout.name,
        sport_type_id: workout.sport_type_id,
      },
    });

    return schedule;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create workout' + error);
  }
}