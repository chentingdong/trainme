import { db } from '@trainme/db';
import { protectedProcedure } from '@/server/trpc';

export const connected = protectedProcedure
  .query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return !!user?.stravaRefreshToken && !!user?.athleteId;
  });
