// This function redirects the user to Strava's OAuth URL
export const getStravaAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const port = ':' + process.env.NEXT_PUBLIC_PORT || '';
  const redirectUri = `http://localhost${port}/api/authorize`;
  const scope = 'activity:read_all';

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;
  return stravaAuthUrl;
};
