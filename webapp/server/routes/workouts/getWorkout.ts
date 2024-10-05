import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const getWorkout = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const workout = await db.workout.findUnique({
      where: {
        id: input.id,
      },
    });

    return workout;
  });

