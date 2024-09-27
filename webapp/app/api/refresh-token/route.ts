import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 400 },
    );
  }

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Client ID or secret not configured" },
      { status: 500 },
    );
  }

  const tokenUrl = "https://www.strava.com/api/v3/oauth/token";

  try {
    const response = await axios.post(tokenUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const accessToken = response.data.access_token;

    return NextResponse.json({ accessToken });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error refreshing access token:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return NextResponse.json(
      { error: "Error refreshing access token" },
      { status: 500 },
    );
  }
}
