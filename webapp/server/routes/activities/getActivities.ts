import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

// TODO: these two can be merged into one
export const getActivities = protectedProcedure
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
    })
  )
  .query(async ({ input }) => {
    const { filter, orderBy } = input || {};
    const activities = await db.activity.findMany({
      include: {
        laps: true
      },
      where: {
        startDateLocal: filter?.startDateLocal
          ? {
            gte: filter.startDateLocal.gte?.toISOString(),
            lt: filter.startDateLocal.lt?.toISOString(),
          }
          : undefined,
      },
      orderBy: orderBy
        ? { startDateLocal: orderBy.startDateLocal as 'asc' | 'desc' }
        : undefined,
    });

    return activities;
  });

export const getPaginatedActivities = protectedProcedure
  .input(
    z.object({
      cursor: z.number().optional(),
      limit: z.number().optional().default(10),
    })
  )
  .query(async ({ input }) => {
    const { cursor = 0, limit } = input;

    const activities = await db.activity.findMany({
      include: {
        laps: true,
      },
      orderBy: { startDateLocal: 'desc' },
      skip: cursor * limit,
      // Fetch one extra to check if there are more results
      take: limit + 1,
    });

    console.log(activities);

    const hasMore = activities.length > limit;
    // Remove the extra item if there are more pages
    if (hasMore) activities.pop();

    return {
      activities,
      hasMore,
    };
  });