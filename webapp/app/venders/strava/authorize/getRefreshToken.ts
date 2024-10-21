import { db } from "@trainme/db";
import axios from "axios";

type GetRefreshTokenInput = {
  userId: string;
  code: string;
};

export const getRefreshToken = async ({ userId, code }: GetRefreshTokenInput) => {
  const tokenUrl = "https://www.strava.com/api/v3/oauth/token";

  console.log('Attempting to exchange code for token');
  const response = await axios.post(tokenUrl, {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code",
  });

  console.log('Strava API response:', response.data);

  const { refresh_token, access_token } = response.data;

  await db.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      stravaRefreshToken: refresh_token,
      stravaAccessToken: access_token
    },
    update: {
      stravaRefreshToken: refresh_token,
      stravaAccessToken: access_token
    },
  });

  return { success: true };
};