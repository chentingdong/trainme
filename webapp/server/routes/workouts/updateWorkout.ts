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

    const updatedWorkout = await db.workout.update({
      where: {
        id: id,
      },
      data: {
        ...workout,
      },
    });

    return updatedWorkout;
  });