import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const deleteWorkoutSchedule = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const success = await db.workout_schedule.delete({
      where: {
        id: input.id,
      },
    });

    return success;
  });