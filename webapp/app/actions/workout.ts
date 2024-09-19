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


export async function createWorkout(workout: Workout): Promise<Workout | null> {
  try {
    //CHECK: why is auto increment not working?
    const lastId = await prisma.workout.aggregate({
      _max: {
        id: true,
      },
    }).then(result => result._max.id) || 0;

    const newWorkout = await prisma.workout.create({
      data: {
        ...workout,
        id: lastId + 1,
      },
    });

    return newWorkout;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create workout' + error); // Return error message to UI
  }
}

export async function updateWorkout(workout: Workout): Promise<Workout | null> {
  try {
    const updatedWorkout = await prisma.workout.update({
      where: {
        id: workout.id,
      },
      data: workout,
    });

    return updatedWorkout;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update workout' + error); // Return error message to UI
  }
}