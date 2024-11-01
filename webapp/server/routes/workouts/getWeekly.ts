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

export const getWeeklyWorkouts = protectedProcedure
  .input(z.object({
    aday: z.date()
  }))
  .query(async ({ input }) => {
    const { aday } = input;
    return await getWeeklyWorkoutsDB(aday);
  });

export const getWeeklyWorkoutsDB = async (aday: Date) => {
  // Find the start and end of the week
  const weekStart = startOfWeek(aday, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(aday, { weekStartsOn: 1 });

  const workouts = await db.workout.findMany({
    where: {
      date: {
        gte: weekStart,
        lt: weekEnd
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  return workouts;
};

export const getWeeklyWorkoutsSummary = protectedProcedure
  .input(z.object({
    aday: z.date()
  }))
  .query(async ({ input }) => {
    const { aday } = input;
    const weekStart = startOfWeek(aday, { weekStartsOn: 1 }).toISOString();
    const weekEnd = endOfWeek(aday, { weekStartsOn: 1 }).toISOString();

    const summary = await db.workout.groupBy({
      by: ['sportType'],
      where: {
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
