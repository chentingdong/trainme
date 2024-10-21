import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const updateWorkout = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      workout: z.record(z.string(), z.any()).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, workout } = input;

    if (!id || !workout) {
      throw new Error("Workout data is missing");
    }

    // If the workout is not found, create it
    const existingWorkout = await db.workout.findUnique({
      where: { id },
    });

    if (!existingWorkout && workout) {
      await db.workout.create({
        data: workout
      }).catch((error) => {
        throw error;
      });
    }

    // Update the workout
    const updatedWorkout = await db.workout.update({
      where: {
        id: id,
      },
      data: {
        ...workout,
      },
    }).catch((error) => {
      throw error;
    });

    return updatedWorkout;
  });