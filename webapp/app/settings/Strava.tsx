"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { getStravaAuthUrl } from '@/app/api/strava/authorization';
import { useStravaSync } from '@/app/hooks/useStravaSync';

export default function Strava() {
  const [refreshToken, setRefreshToken] = useState<string | null>("");
  const { syncStrava } = useStravaSync();

  const disConnectStrava = () => {
    Cookies.remove("strava_refresh_token");
    Cookies.remove("strava_access_token");
    window.location.reload();
  };

  const connectStrava = () => {
    window.location.href = getStravaAuthUrl();
  };

  React.useEffect(() => {
    const token = Cookies.get("strava_refresh_token") || null;
    setRefreshToken(token);
  }, []);

  return (
    <div>
      <h2>Strava</h2>
      <div className="py-4 flex gap-4">
        {refreshToken && (
          <button
            className="btn btn-secondary"
            onClick={() => disConnectStrava()}
          >
            Disconnect Strava
          </button>
        )}
        {refreshToken === null && (
          <button className="btn btn-primary" onClick={() => connectStrava()}>
            Connect to Strava
          </button>
        )}
        <button className="btn btn-primary" onClick={() => syncStrava()}>Sync Strava Data</button>
      </div>
    </div>
  );
}
