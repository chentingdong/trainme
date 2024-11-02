import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const getMany = protectedProcedure
  .input(
    z.object({
      filter: z
        .object({
          startDateLocal: z
            .object({
              gte: z.date().optional(),
              lt: z.date().optional(),
            })
            .optional(),
        })
        .optional(),
      orderBy: z
        .object({
          startDateLocal: z.string().optional(),
        })
        .optional(),
      cursor: z.number().optional().default(0),
      limit: z.number().optional().default(20),
    })
  )
  .query(async ({ ctx, input }) => {
    const { filter, orderBy, cursor, limit } = input || {};
    const { athleteId } = ctx;

    const activities = await db.activity.findMany({
      where: {
        startDateLocal: filter?.startDateLocal
          ? {
            gte: filter.startDateLocal.gte?.toISOString(),
            lt: filter.startDateLocal.lt?.toISOString(),
          }
          : undefined,
        athleteId,
      },
      orderBy: orderBy
        ? { startDateLocal: orderBy.startDateLocal as 'asc' | 'desc' }
        : undefined,
      skip: cursor * limit,
      // Fetch one extra to check if there are more results
      take: limit + 1,
    });

    const hasMore = activities.length > limit;
    // Remove the extra item if there are more pages
    if (hasMore) activities.pop();

    return { activities, hasMore };
  });

