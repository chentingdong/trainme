import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';
import { z } from 'zod';

export const getSchedules = protectedProcedure
  .input(
    z.object({
      filter: z
        .object({
          date: z
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
    const schedules = await db.schedule.findMany({
      where: {
        date: filter?.date
          ? {
            gte: filter.date.gte,
            lte: filter.date.lte,
          }
          : undefined,
      },
      include: {
        workout: true,
      },
    });

    return schedules;
  });
