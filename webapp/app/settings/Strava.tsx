"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { getStravaAuthUrl } from '@/app/api/strava/authorization';

export default function Strava() {
  const [refreshToken, setRefreshToken] = useState<string | null>("");

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
      <p>Connect your Strava account to let the app sync your activities.</p>
      <div className="py-4">
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
      </div>
    </div>
  );
}
