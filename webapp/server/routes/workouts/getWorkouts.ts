import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const getWorkouts = protectedProcedure
  .input(
    z.object({
      filter: z.record(z.string(), z.any()).optional()
    })
  )
  .query(async ({ input }) => {
    const workouts = await db.workout.findMany({
      where: {
        ...(input?.filter || {})
      },
      include: {
        sport_type: true
      }
    });

    return workouts;
  });

export const getScheduledWorkoutsByDate = protectedProcedure
  .input(
    z.object({
      date: z.date().optional()
    })
  )
  .query(async ({ input }) => {
    const workoutSchedules = await db.workout_schedule.findMany({
      include: {
        workout: {
          include: {
            sport_type: true
          }
        }
      },
      where: {
        schedule_date: input?.date
      },
    });

    const workouts = workoutSchedules.map(workoutSchedule => workoutSchedule.workout);
    return workouts;
  });