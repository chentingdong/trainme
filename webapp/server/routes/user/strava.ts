import { db } from '@/prisma';
import { protectedProcedure } from '@/server/trpc';

export const stravaConnected = protectedProcedure
  .query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return !!user?.stravaRefreshToken && !!user?.stravaAccessToken;
  });
