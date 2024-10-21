import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const createSchedule = protectedProcedure
  .input(
    z.object({
      workoutId: z.string(),
      date: z.date(),
    })
  )
  .mutation(async ({ input }) => {
    const { workoutId, date } = input;

    const schedule = await db.schedule.create({
      data: {
        id: uuidv4(),
        workoutId: workoutId,
        date: date,
      },
    });

    return schedule;
  });
