import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';

export const disconnect = protectedProcedure.mutation(async ({ ctx }) => {
  await db.user.update({
    where: { id: ctx.userId },
    data: {
      stravaRefreshToken: null,
      stravaAccessToken: null
    },
  });
});
