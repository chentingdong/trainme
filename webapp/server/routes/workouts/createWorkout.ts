import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const createWorkout = protectedProcedure
  .input(
    z.object({
      workout: z.record(z.string(), z.any()).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { workout } = input;

    if (!workout) {
      throw new Error("Workout data is missing");
    }

    const newWorkout = await db.workout.create({
      data: workout
    }).catch((error) => {
      console.error(error);
      throw new Error("Failed to create workout");
    });
    return newWorkout;
  });