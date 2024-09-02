"use client";

import React from 'react';
import Cookies from 'js-cookie';
import { getStravaAuthUrl } from '@/utils/strava';

const Page = () => {
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = Cookies.get('strava_refresh_token') || null;
    setRefreshToken(token);
  }, []);

  const disConnectStrava = () => {
    Cookies.remove('strava_refresh_token');
    Cookies.remove('strava_access_token');
  };

  const connectStrava = () => {
    window.location.href = getStravaAuthUrl(); 
  }

  return (
    <div className="container">
      <div>
        <h1>Connections</h1>
        <hr />
        <h2>Strava</h2>
        <p>Connect your Strava account to let the app sync your activities.</p>
        <div className='py-4'>
          {refreshToken && (
            <button className="btn btn-secondary" onClick={() => disConnectStrava()}>Disconnect Strava</button>
          )}
          {!refreshToken && (
            <button className="btn btn-primary" onClick={() => connectStrava()}>Connect to Strava</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;