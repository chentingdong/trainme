import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { startOfWeek, endOfWeek } from 'date-fns';
import convert from 'convert-units';

export type ActivitiesSummaryType = {
  sportType: string;
  _sum: {
    distance: number;
    movingTime: number;
  };
};

export const getWeeklyActivitiesSummary = protectedProcedure
  .input(z.object({
    aday: z.date()
  }))
  .query(async ({ ctx, input }) => {
    const { aday } = input;

    const weekStart = startOfWeek(aday, { weekStartsOn: 1 }).toISOString();
    const weekEnd = endOfWeek(aday, { weekStartsOn: 1 }).toISOString();
    const { athleteId } = ctx;

    const summary = await db.activity.groupBy({
      by: ['sportType'],
      where: {
        startDateLocal: {
          gte: weekStart,
          lt: weekEnd,
        },
        athleteId,
      },
      _sum: {
        distance: true,
        movingTime: true,
      },
    });

    return summary.map((s: ActivitiesSummaryType) => ({
      sportType: s.sportType,
      _sum: {
        distance: parseFloat(convert(s._sum.distance).from('m').to('km').toFixed(2)),
        movingTime: s._sum.movingTime,
      }
    }));
  });
