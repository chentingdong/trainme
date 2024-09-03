"use client";

import React from 'react';
import { Activity, getStravaActivities } from '@/app/actions/activities';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/lengthUtils';
import ActivityIcon from './ActivityIcon';
import ActivityMap from './ActivityMap';
import ActivityLaps from './ActivityLaps';

type Props = {};

function Page({ }: Props) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const [activities, setActivities] = React.useState<Activity[]>([]);

  React.useEffect(() => {
    getStravaActivities(startDate, endDate).then((activities) => {
      // failes with 429, too many requests
      setActivities(activities.slice(0, 2));
    });
  }, []);

  return (
    <div>
      <h1>Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className='card my-2'>
            <div className='card-header flex items-center'>
              <ActivityIcon type={activity.type} />
              <div className='mx-4'>{activity.name}</div>
              <div className='text-sm'>{new Date(activity.start_date_local).toLocaleDateString()}</div>
            </div>
            <div className="card-body">
              <div className='my-4'>
                <div className="flex gap-4">
                  <div>{new Date(activity.start_date_local).toLocaleDateString()}</div>
                  <div>{activity.type}</div>
                  <div>{activity.distance} meters</div>
                  <div>{activity.moving_time} seconds</div>
                  <div>{activity.total_elevation_gain} meters</div>
                </div>
              </div>
              {activity.map?.summary_polyline && (
                <div className="grid grid-cols-2 gap-4 h-128">
                  <ActivityMap summary_polyline={activity.map?.summary_polyline} />
                <ActivityLaps activityId={activity.id} />
              </div>
              )}
            </div>
            <div className='card-footer'>
              {formatDistance(activity.distance)} in {formatTimeSeconds(activity.moving_time)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
