import React from 'react';
import ActivityIcon from './ActivityIcon';
import ActivityLaps from './ActivityLaps';
import ActivityMap from './ActivityMap';
import type { activity as Activity } from '@prisma/client';

type Props = {
  activity: Activity;
};

export default function ActivityOne({ activity }: Props) {
  return (
    <div>
      <div className='card-header flex items-center'>
        <ActivityIcon type={activity.type} />
        <div className='mx-4'>{activity.name}</div>
      </div>
      <div className="card-body">
        <div className='my-4'>
          <div className="flex gap-4">
            <div>{activity.id}</div>
            <div>{activity.type}</div>
            <div>{activity.distance} meters</div>
            <div>{activity.moving_time} seconds</div>
            <div>{activity.total_elevation_gain} meters</div>
          </div>
        </div>
        {(activity.map && typeof activity.map === 'object' && 'summary_polyline' in activity.map && typeof activity.map.summary_polyline === 'string') && (
          <div className="grid grid-cols-5 gap-8 h-128">
            <ActivityMap className='col-span-2' summary_polyline={activity.map.summary_polyline} />
            <ActivityLaps className='col-span-3' activityId={activity.id} />
          </div>
        )}
      </div>
      <div className='card-footer'>
        {activity.distance}
      </div>
    </div>
  );
}