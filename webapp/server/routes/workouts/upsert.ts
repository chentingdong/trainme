import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
export const upsert = protectedProcedure
  .input(
    z.object({
      workout: z.record(z.string(), z.any()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { workout } = input;

    if (!workout) {
      throw new Error("Workout data is missing");
    }

    const user = await db.user.findUnique({ where: { id: ctx.userId } });
    const athleteId = user?.athleteId;
    const workoutId = workout.id === '' ? uuidv4() : workout.id;

    if (!athleteId) {
      throw new Error("Please link to strava in /settings");
    }

    const existingWorkout = await db.workout.findUnique({
      where: { id: workoutId },
    });

    if (existingWorkout) {
      return await db.workout.update({
        where: { id: workoutId },
        data: { ...workout },
      });
    }

    return await db.workout.create({
      data: { ...workout, id: workoutId, athleteId },
    });
  });
