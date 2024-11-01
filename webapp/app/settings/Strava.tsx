"use client";

import React, { useState } from 'react';
import { trpc } from '@/app/api/trpc/client';
import Athlete from '@/app/settings/Athlete';
import { useRouter } from 'next/navigation';
import { FcSynchronize } from 'react-icons/fc';

export default function Strava() {
  const router = useRouter();
  const { data: connected, refetch } = trpc.strava.connected.useQuery();
  const { mutate: disconnect } = trpc.strava.disconnect.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { mutateAsync: syncStrava, isPending } = trpc.strava.sync.useMutation();

  const [fromDaysAgo, setFromDaysAgo] = useState(7);

  const handleConnect = () => {
    window.location.href = getAuthUrl();
  };

  const handleBuyMeCoffee = () => {
    router.push('/pricing');
  };


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
        <p className="text-sm my-4">
          {connected
            ? 'Connected to Strava.'
            : 'Connect your Strava account to sync your activities.'}
        </p>
        {connected && <Athlete />}
      </div>
      <div className="grid-cols-1">
        <button
          className="btn btn-primary flex justify-center gap-4 items-center"
          onClick={() => syncStrava({ fromDaysAgo })}
          disabled={isPending}
        >
          Sync Strava Data
          {isPending && <FcSynchronize className="icon loading-icon" />}
        </button>
        <div className="mt-4">
          <p className="mb-2 font-medium">Sync Data From:</p>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="syncStartDate"
                value="1week"
                checked={fromDaysAgo === 7}
                onChange={() => setFromDaysAgo(7)}
              />
              <span className="ml-2">Last week</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="syncStartDate"
                value="1month"
                checked={fromDaysAgo === 30}
                onChange={() => setFromDaysAgo(30)}
              />
              <span className="ml-2">Last month</span>
            </label>
            <label className="inline-flex items-center disabled" title="Coming soon">
              <input
                type="radio"
                className="form-radio"
                name="syncStartDate"
                value="3months"
                disabled={true}
                checked={fromDaysAgo === 90}
                onChange={() => setFromDaysAgo(90)}
              />
              <span className="ml-2">Last 3 months</span>
            </label>
            <label className="inline-flex items-center disabled" title="Coming soon">
              <input
                type="radio"
                className="form-radio"
                name="syncStartDate"
                value="all"
                disabled={true}
                checked={fromDaysAgo === 0}
                onChange={() => setFromDaysAgo(0)}
              />
              <span className="ml-2">All time</span>
            </label>
          </div>
          <div className="mt-2">
            {fromDaysAgo === 30 && (
              <>
                {isPending && (
                  <p className="text-sm text-gray-500">
                    This will take a while, please be patient.
                  </p>
                )}
                {!isPending && (
                  <p className="text-sm text-gray-500">
                    Sync successful.
                  </p>
                )}
              </>
            )}
            {fromDaysAgo === 0 && (
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const redirectUri = `${baseUrl}/venders/strava/authorize`;
  const scope = 'activity:read_all';

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;

  return stravaAuthUrl;
};
