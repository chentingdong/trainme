// get access token from strava using refresh token

import { exchangeAccessToken } from '@/app/venders/strava/authorize/exchangeAccessToken';
import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';

export const updateAccessToken = protectedProcedure
  .query(async ({ ctx }) => {
    const userId = ctx.userId;
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (user.stravaRefreshToken === null) {
      throw new Error('Strava refresh token not found for user, need to connect to Strava.');
    }
    const accessToken = await exchangeAccessToken({ userId, refreshToken: user.stravaRefreshToken });
    return accessToken;
  });
