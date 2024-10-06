import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const createWorkoutSchedule = protectedProcedure
  .input(
    z.object({
      workout_id: z.string(),
      date: z.date(),
    })
  )
  .mutation(async ({ input }) => {
    const { workout_id, date } = input;

    const schedule = await db.workout_schedule.create({
      data: {
        id: uuidv4(),
        workout_id: workout_id,
        schedule_date: date,
      },
    });

    return schedule;
  });
