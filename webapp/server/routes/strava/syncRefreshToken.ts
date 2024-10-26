import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { db } from "@trainme/db";
import axios from "axios";
import { fetchAthlete } from '@/server/routes/strava/syncAthlete';

type GetRefreshTokenInput = {
  userId: string;
  code: string;
};

const getRefreshToken = async ({ userId, code }: GetRefreshTokenInput) => {
  const tokenUrl = "https://www.strava.com/api/v3/oauth/token";

  const response = await axios.post(tokenUrl, {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code",
  });

  const {
    refresh_token,
    access_token,
    expires_at
  } = response.data;


  await db.user.update({
    where: { id: userId },
    data: {
      stravaRefreshToken: refresh_token,
      stravaAccessToken: access_token,
      accessTokenExpiresAt: new Date(expires_at * 1000)
    }
  });
  await fetchAthlete(access_token);

  return { success: true };
};

export const syncRefreshToken = protectedProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { code } = input;
    if (!ctx.userId) {
      throw new Error("User ID is required");
    }
    try {
      return await getRefreshToken({ userId: ctx.userId, code });
    } catch (error) {
      console.error('error syncing refresh token', error);
      throw error;
    }
  });

