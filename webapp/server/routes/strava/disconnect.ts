import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';

export const disconnect = protectedProcedure
  .mutation(async ({ ctx }) => {
    try {
      await db.user.update({
        where: { id: ctx.userId },
        data: {
          stravaRefreshToken: null,
          stravaAccessToken: null,
          accessTokenExpiresAt: null,
          athleteId: null
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to disconnect Strava:', error);
      return false;
    }
  });
