// app/api/exchange-token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Client ID or secret not configured' }, { status: 500 });
  }

  const tokenUrl = 'https://www.strava.com/api/v3/oauth/token';

  try {
    const response = await axios.post(tokenUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
    });

    const accessToken = response.data.access_token;
    return NextResponse.json({ accessToken: accessToken });
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    return NextResponse.json({ error: 'Error exchanging authorization code' }, { status: 500 });
  }
}