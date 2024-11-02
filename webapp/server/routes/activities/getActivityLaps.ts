import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';
import { z } from 'zod';

export const getActivityLaps = protectedProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { athleteId } = ctx;

    const activity = await db.activity.findUnique({
      where: {
        id: input.id,
        athleteId,
      },
    });

    if (!activity) return [];

    const laps = await db.lap.findMany({
      where: {
        activityId: activity.id,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return laps;
  });
