import React from 'react';
import { Activity, getActivities } from '@/app/actions/activities';
import Debug from '@/app/components/Debug';

type Props = {};

async function Page({ }: Props) {
  const activities: Activity[] = await getActivities();

  return (
    <div>
      <h1>Activities</h1>
      <Debug data={activities} />
    </div>
  );
}

export default Page;