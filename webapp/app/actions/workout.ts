"use server";

import { prisma } from '@/prisma';
import type { workout as Workout } from '@prisma/client';


export async function getWorkouts(type?: string): Promise<Workout[]> {
  const workouts = await prisma.workout.findMany({
    where: type ? { type } : {},
  });

  return workouts;
}

export async function getWorkoutById(id: number): Promise<Workout> {
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

