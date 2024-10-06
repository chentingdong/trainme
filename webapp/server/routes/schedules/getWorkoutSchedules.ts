import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';
import { z } from 'zod';

export const getWorkoutSchedules = protectedProcedure
  .input(
    z.object({
      filter: z
        .object({
          schedule_date: z
            .object({
              gte: z.date().optional(),
              lte: z.date().optional(),
            })
            .optional(),
        })
        .optional(),
    })
  )
  .query(async ({ input }) => {
    const { filter } = input || {};
    const workoutSchedules = await db.workout_schedule.findMany({
      where: {
        ...(filter || {}),
      },
      include: {
        workout: {
          include: {
            sport_type: true,
          },
        },
      },
    });

    return workoutSchedules;
  });