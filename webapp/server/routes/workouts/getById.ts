import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const getById = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { athleteId } = ctx;
    const workout = await db.workout.findUnique({
      where: {
        id: input.id,
        athleteId,
      },
    });

    if (!workout) {
      throw new Error('Workout not found or not belong to this athlete.');
    }

    if (!athleteId) {
      throw new Error('This workout belongs other athlete, should not happen.');
    }

    return workout;
  });

