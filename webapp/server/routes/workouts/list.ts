import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const list = protectedProcedure
  .input(
    z.object({
      filter: z.record(z.string(), z.any()).optional()
    })
  )
  .query(async ({ input }) => {
    const workouts = await db.workout.findMany({
      where: {
        ...(input?.filter || {})
      },
    });

    return workouts;
  });