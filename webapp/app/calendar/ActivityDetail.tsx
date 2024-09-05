"use client";

import React, { useEffect } from 'react';
import { Activity, getActivityFromStravaById } from '../actions/activities';
import Loading from '../components/Loading';
import ActivityMap from '../activities/ActivityMap';

type Props = {
  activityId: number | null;
};

export default function ActivityDetail({ activityId }: Props) {
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (activityId) {
      getActivityFromStravaById(activityId)
        .then((activity) => {
          setActivity(activity);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activityId]);

  return (
    <div className='m-4'>
      <div>
        {loading && <Loading size={32} />}
        {activity && (
          <div className='text-gray-700 my-4'>
            <h3 >{activity.name}</h3>
            <div className="flex gap-4">
              <div>{new Date(activity.start_date_local).toLocaleDateString()}</div>
              <div>{activity.type}</div>
              <div>{activity.distance} meters</div>
              <div>{activity.moving_time} seconds</div>
              <div>{activity.total_elevation_gain} meters</div>
            </div>
          </div>
        )}
      </div>
      <ActivityMap summary_polyline={activity?.map?.summary_polyline} />
    </div>
  );
}
