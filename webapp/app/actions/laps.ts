"use server";

import { getStravaAccessToken } from '@/utils/strava';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function getActivityLaps(activityId: number) {
  // Get refresh token from cookies
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('strava_refresh_token')?.value;

  // Get temporary access token from Strava
  const accessToken = await getStravaAccessToken(refreshToken);

  const url = new URL(`https://www.strava.com/api/v3/activities/${activityId}/laps`);
  const response = await axios.get(url.href, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = response.data;
  return data;
}