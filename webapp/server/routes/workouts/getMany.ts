import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const getMany = protectedProcedure
  .input(
    z.object({
      filter: z.object({
        date: z.object({
          gte: z.date().optional(),
          lt: z.date().optional(),
        }).optional()
      }).optional(),
      orderBy: z.object({
        startDateLocal: z.string().optional()
      }).optional()
    })
  )
  .query(async ({ ctx, input }) => {
    const { athleteId } = ctx;
    const workouts = await db.workout.findMany({
      where: {
        athleteId,
        date: input?.filter?.date
          ? {
            gte: input.filter.date.gte?.toISOString(),
            lt: input.filter.date.lt?.toISOString(),
          }
          : undefined,
      },
    });

    return workouts;
  });

