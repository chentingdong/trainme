import axios from "axios";

// This function redirects the user to Strava's OAuth URL
export const getStravaAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const port = ":" + process.env.NEXT_PUBLIC_PORT || "";
  const redirectUri = `http://localhost${port}/api/authorize`;
  const scope = "activity:read_all";

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;
  return stravaAuthUrl;
};

// get access token from refresh token
export async function getStravaAccessToken(
  refreshToken: string | undefined,
): Promise<string> {
  if (!refreshToken && typeof window !== "undefined") {
    window.location.href = getStravaAuthUrl();
    return "";
  }

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Client ID or secret not configured");
  }

  const tokenUrl = "https://www.strava.com/api/v3/oauth/token";

  try {
    const response = await axios.post(tokenUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error refreshing access token:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Error refreshing access token");
  }
}
