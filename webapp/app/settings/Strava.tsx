"use client";

import React, { useState, useEffect } from 'react';
import { trpc } from '@/app/api/trpc/client';
import Athlete from '@/app/settings/Athlete';
import { useRouter } from 'next/navigation';

export default function Strava() {
  const router = useRouter();
  const { mutate: disconnect } = trpc.strava.disconnect.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { data: connected, refetch } = trpc.strava.connected.useQuery();
  const { mutateAsync } = trpc.strava.sync.useMutation();

  const [syncStartDate, setSyncStartDate] = useState('3months');

  const handleConnect = () => {
    window.location.href = getAuthUrl();
  };

  const handleBuyMeCoffee = () => {
    router.push('/pricing');
  };

  useEffect(() => {
    // This effect runs on the client side
    if (syncStartDate === 'all') {
      // Perform any client-side logic here if needed
    }
  }, [syncStartDate]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="grid-cols-1">
        <div className="flex gap-4">
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
        </div>
        <p className="text-sm">
          {connected
            ? 'Connected to Strava.'
            : 'Connect your Strava account to sync your activities.'}
        </p>
        {connected && <Athlete />}
      </div>
      <div className="grid-cols-1">
        <button className="btn btn-primary" onClick={() => mutateAsync()}>Sync Strava Data</button>
        <div className="mt-4">
          <p className="mb-2 font-medium">Sync Data From:</p>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="syncStartDate"
                value="3months"
                checked={syncStartDate === '3months'}
                onChange={() => setSyncStartDate('3months')}
              />
              <span className="ml-2">Last 3 months</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="syncStartDate"
                value="all"
                checked={syncStartDate === 'all'}
                onChange={() => setSyncStartDate('all')}
              />
              <span className="ml-2">All time</span>
            </label>
          </div>
          <div className="mt-2">
            {syncStartDate === 'all' && (
              <button
                onClick={handleBuyMeCoffee}
                className="text-blue-600 hover:underline"
              >
                Buy me a coffee
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '';
  const port = process.env.NEXT_PUBLIC_PORT ? `:${process.env.NEXT_PUBLIC_PORT}` : '';
  const redirectUri = `http://localhost${port}/venders/strava/authorize`;
  const scope = 'activity:read_all';

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;

  return stravaAuthUrl;
};
