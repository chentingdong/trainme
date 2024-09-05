'use client';

import React from 'react';

import Garmin from './Garmin';
import Strava from './Strava';

const Page = () => {
  return (
    <div className='container'>
      <div>
        <h1>Connections</h1>
        <Strava />
        <Garmin />
      </div>
    </div>
  );
};

export default Page;
