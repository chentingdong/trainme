import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const getActivities = protectedProcedure
  .input(
    z.object({
      filter: z
        .object({
          start_date_local: z
            .object({
              gte: z.date().optional(),
              lt: z.date().optional(),
            })
            .optional(),
        })
        .optional(),
      orderBy: z
        .object({
          start_date_local: z.string().optional(),
        })
        .optional(),
    })
  )
  .query(async ({ input }) => {
    const { filter, orderBy } = input || {};
    const activities = await db.activity.findMany({
      where: {
        start_date_local: filter?.start_date_local
          ? {
            gte: filter.start_date_local.gte?.toISOString(),
            lt: filter.start_date_local.lt?.toISOString(),
          }
          : undefined,
      },
      orderBy: orderBy
        ? { start_date_local: orderBy.start_date_local as 'asc' | 'desc' }
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
      orderBy: { start_date_local: 'desc' },
      skip: cursor * limit,
      // Fetch one extra to check if there are more results
      take: limit + 1,
    });

    const hasMore = activities.length > limit;
    // Remove the extra item if there are more pages
    if (hasMore) activities.pop();

    return {
      activities,
      hasMore,
    };
  });