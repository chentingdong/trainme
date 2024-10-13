import { db } from "@trainme/db";
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const deleteSchedule = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const success = await db.schedule.delete({
      where: {
        id: input.id,
      },
    });

    return success;
  });