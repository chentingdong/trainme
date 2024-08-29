import React from 'react';
import { Activity, getActivities } from '../actions/activities';

type Props = {};

async function Page({ }: Props) {
  const activities: Activity[] = await getActivities();

  return (
    <div>
      <h1>Activities</h1>
      <pre>
        {JSON.stringify(activities, null, 2)}
      </pre>
    </div>
  );
}

export default Page;