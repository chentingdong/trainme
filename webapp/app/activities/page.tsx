import React from 'react';
import { Activity, getActivitiesFromStrava } from '@/app/actions/activities';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/lengthUtils';
import ActivityIcon from './ActivityIcon';

type Props = {};

async function Page({ }: Props) {
  const activities: Activity[] = await getActivitiesFromStrava();

  return (
    <div>
      <h1>Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className='card m-2'>
            <div className='card-header flex items-center'>
              <ActivityIcon type={activity.type} />
              <div className='mx-4'>{activity.name}</div>
              <div className='text-sm'>{new Date(activity.start_date).toLocaleDateString()}</div>
            </div>
            <div className='card-body'>
              {formatDistance(activity.distance)} in {formatTimeSeconds(activity.moving_time)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
