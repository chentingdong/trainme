import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const deleteById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const { id } = input;
    await db.workout.delete({ where: { id } });
  });