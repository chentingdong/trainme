import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const deleteById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { athleteId } = ctx;
    const workout = await db.workout.findUnique({ where: { id: input.id, athleteId } });
    if (!workout) {
      throw new Error('Workout not found or not belong to this athlete.');
    }
    await db.workout.delete({ where: { id: input.id, athleteId } });
  });