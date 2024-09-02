"use client";

import React, { useEffect } from 'react';
import axios from 'axios';

const AuthorizationHandler = () => {
  const [message, setMessage] = React.useState('Authorizing...');
  const [hasError, setHasError] = React.useState(false);

  useEffect((): void => {
    // Check if there is a 'code' query parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      axios
        .post('/api/exchange-token', { code: authorizationCode })
        .then((response) => {
          const accessToken = response.data.accessToken;
          if (!accessToken) {
            console.error('No access token received:', response.data);
            return;
          } else {
            console.log('Granted access to Strava.');
            window.location.href = '/settings';
          }
        })
        .catch((error) => {
          console.error('Error exchanging authorization code:', error);
          setMessage('Error exchanging authorization code.');
          setHasError(true);
        });
    } else {
      setMessage('Disconnected to Strava.');
      setHasError(true);
    }
  }, []);

  return (
    <div className="container">
      <p>{message}</p>
      {hasError && (
        <a className="text-blue-500 hover:text-blue-700" href="/settings">Back to Settings</a>
      )}
    </div>
  );
};

export default AuthorizationHandler;