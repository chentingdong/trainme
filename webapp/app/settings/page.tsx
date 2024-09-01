"use client";

import React from 'react';

const Page = () => {
  const accessToken = sessionStorage.getItem('strava_access_token');

  const connectToStrava = () => {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const port = ':' + process.env.NEXT_PUBLIC_PORT || '';
    const redirectUri = `http://localhost${port}/api/authorize`;
    const scope = 'activity:read_all';

    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&_prompt=force`;

    window.location.href = stravaAuthUrl; // Redirect the user to Strava's auth URL
  };

  const disConnectStrava = () => {
    sessionStorage.removeItem('strava_access_token');
    window.location.href = '/settings';
  }

  return (
    <div className="container">
      <div>
        <h1>Connections</h1>
        <hr />
        <h2>Strava</h2>
        <p>Connect your Strava account to let the app sync your activities.</p>
        <div className='py-4'>
          {accessToken && (
            <button className="btn btn-secondary" onClick={() => disConnectStrava()}>Disconnect Strava</button>
          )}
          {!accessToken && (
            <button className="btn btn-primary" onClick={() => connectToStrava()}>Connect to Strava</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;