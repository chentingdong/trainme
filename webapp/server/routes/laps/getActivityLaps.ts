import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';
import { z } from 'zod';

export const getActivityLaps = protectedProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .query(async ({ input }) => {
    const activity = await db.activity.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!activity) return [];

    const laps = await db.lap.findMany({
      where: {
        activity_id: activity.id,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return laps;
  });
