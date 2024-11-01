import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { endOfWeek, startOfWeek } from 'date-fns';

export type WeeklyWorkoutsSummaryType = {
  sportType: string;
  _sum: {
    distance: number;
    duration: number;
  };
};

export const getWeeklyWorkoutsSummary = protectedProcedure
  .input(z.object({
    aday: z.date()
  }))
  .query(async ({ ctx, input }) => {
    const { athleteId } = ctx;
    const { aday } = input;
    const weekStart = startOfWeek(aday, { weekStartsOn: 1 }).toISOString();
    const weekEnd = endOfWeek(aday, { weekStartsOn: 1 }).toISOString();

    const summary = await db.workout.groupBy({
      by: ['sportType'],
      where: {
        athleteId,
        date: {
          gte: weekStart,
          lt: weekEnd
        }
      },
      _sum: {
        distance: true,
        duration: true,
      },
    });

    return summary.map((s: WeeklyWorkoutsSummaryType) => ({
      sportType: s.sportType,
      _sum: {
        distance: s._sum.distance,
        duration: s._sum.duration,
      }
    }));
  });
