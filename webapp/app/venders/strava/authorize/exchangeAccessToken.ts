import { db } from "@trainme/db";
import axios from "axios";

type ExchangeAccessTokenInput = {
  userId: string;
  refreshToken: string;
};

export const exchangeAccessToken = async ({ userId, refreshToken }: ExchangeAccessTokenInput) => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Client ID or secret not configured");
  }
  const tokenUrl = "https://www.strava.com/api/v3/oauth/token";
  const { data } = await axios.post(tokenUrl, {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const accessToken = data.access_token as string;

  db.user.update({
    where: { id: userId },
    data: {
      stravaAccessToken: accessToken
    },
  });
};
