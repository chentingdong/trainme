"use client";

import { useStravaSync } from '@/app/hooks/useStravaSync';
import { trpc } from '@/app/api/trpc/client';

export default function Strava() {
  const { syncStrava } = useStravaSync();
  const { data: stravaConnected, refetch: refetchStravaConnected } = trpc.user.stravaConnected.useQuery();

  const handleConnect = () => {
    window.location.href = getAuthUrl();
  };

  const handleDisconnect = () => {
    try {
      trpc.strava.disconnect.useMutation({
        onSuccess: () => refetchStravaConnected(),
      });
    } catch (error) {
      console.error('Failed to disconnect Strava:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div>
      <h2>Strava</h2>
      <div className="py-4 flex gap-4">
        {!stravaConnected && (
          <button className="btn btn-primary" onClick={handleConnect}>
            Connect to Strava
          </button>
        )}
        {stravaConnected && (
          <button
            className="btn btn-secondary"
            onClick={handleDisconnect}
          >
            Disconnect Strava
          </button>
        )}
        <button className="btn btn-primary" onClick={syncStrava}>Sync Strava Data</button>
      </div>
    </div>
  );
}

export const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '';
  const port = ":" + process.env.NEXT_PUBLIC_PORT || "";
  const redirectUri = `http://localhost${port}/venders/strava/authorize`;

  const scope = 'activity:read_all';
  // const params = new URLSearchParams({
  //   client_id: clientId,
  //   response_type: 'code',
  //   redirect_uri: encodeURIComponent(redirectUri),
  //   scope: scope,
  //   _prompt: 'force'
  // });
  // const stravaAuthUrl = `https://www.strava.com/oauth/authorize?${params.toString()}`;

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;

  return stravaAuthUrl;
};
