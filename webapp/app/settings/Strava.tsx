"use client";

import { trpc } from '@/app/api/trpc/client';
import Athlete from '@/app/settings/Athlete';

export default function Strava() {
  const { mutate: disconnect } = trpc.strava.disconnect.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { data: connected, refetch } = trpc.strava.connected.useQuery();
  const handleConnect = () => {
    window.location.href = getAuthUrl();
  };

  const { mutateAsync } = trpc.strava.sync.useMutation();

  return (
    <div>
      <p>
        {connected
          ? 'Connected to Strava.'
          : 'Connect your Strava account to sync your activities.'}
      </p>
      <div className="py-4 flex gap-4">
        {!connected && (
          <button className="btn btn-primary" onClick={handleConnect}>
            Connect to Strava
          </button>
        )}
        {connected && (
          <button
            className="btn btn-secondary"
            onClick={() => disconnect()}
          >
            Disconnect Strava
          </button>
        )}
        <button className="btn btn-primary" onClick={() => mutateAsync()}>Sync Strava Data</button>
      </div>
      {connected && <Athlete />}
    </div>
  );
}

export const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '';
  const port = ":" + process.env.NEXT_PUBLIC_PORT || "";
  const redirectUri = `http://localhost${port}/venders/strava/authorize`;
  const scope = 'activity:read_all';

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;

  return stravaAuthUrl;
};
