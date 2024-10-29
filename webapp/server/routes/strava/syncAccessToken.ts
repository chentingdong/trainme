// get access token from strava using refresh token

import { protectedProcedure } from '@/server/trpc';
import { db } from "@trainme/db";
import axios from "axios";

// exchange access token using refresh token
export const exchangeAccessToken = async (userId: string): Promise<string> => {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
  });

  // user synced before and access token is still valid
  if (user.stravaAccessToken && user.accessTokenExpiresAt && user.accessTokenExpiresAt > new Date()) {
    return user.stravaAccessToken;
  }

  // get new access token using refresh token
  if (!user.stravaRefreshToken) {
    throw new Error("Strava refresh token not found for user, need to connect to Strava.");
  }

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Client ID or secret not configured");
  }
  const tokenUrl = "https://www.strava.com/api/v3/oauth/token";
  const { data } = await axios.post(tokenUrl, {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: user.stravaRefreshToken,
    grant_type: "refresh_token",
  });

  const accessToken = data.access_token as string;

  db.user.update({
    where: { id: userId },
    data: {
      stravaAccessToken: accessToken
    },
  });

  return accessToken;
};

// The trpc query to get the access token.
export const syncAccessToken = protectedProcedure
  .query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new Error("User ID is required");
    }
    const accessToken = await exchangeAccessToken(ctx.userId);
    return accessToken;
  });
