import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';
import { z } from 'zod';

export const getWorkoutSchedules = protectedProcedure
  .input(
    z.object({
      filter: z.record(z.string(), z.any()).optional()
    })
  )
  .query(async ({ input }) => {
    const workoutSchedules = await db.workout_schedule.findMany({
      where: {
        ...(input?.filter || {})
      },
      include: {
        workout: {
          include: {
            sport_type: true
          }
        }
      },
    });
    return workoutSchedules;
  });