"use client";

import React from 'react';
import { Activity, getActivityFromStravaByDate } from '../actions/activities';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTime, formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/lengthUtils';

type CalendarDayProps = {
  date: Date;
  view?: string;
  setSelectedActivityId: (id: number) => void;
};

function CalendarDay({ date, view, setSelectedActivityId }: CalendarDayProps) {
  const [activities, setActivities] = React.useState<Activity[]>([]);

  React.useEffect(() => {
    getActivityFromStravaByDate(date)
      .then((activities) => {
        setActivities(activities);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [date]);

  return (
    <div className="card rounded-sm calendar-tile" >
      <div className="card-header bg-white flex justify-between">
        <div>{date.getDate()}</div>
        <div className='flex gap-2'>
          {activities?.map((activity) => (
            <div key={activity.id}>
              <ActivityIcon type={activity.type} />
            </div>
          ))}
        </div>
      </div>
      <div className='h-60 overflow-auto'>
        <ul className="m-1 shadow-sm">
          {activities?.map((activity) => (
            <li key={activity.id} className='card my-1'
              onClick={() => setSelectedActivityId(activity.id)}>
              <div className='card-header text-sm flex items-center'>
                <div > {formatTimeSeconds(activity.moving_time)}</div>
              </div>
              <div className='card-body flex justify-between'>
                <div className='ml-2'>{formatTime(activity.start_date_local)}</div>
                <div>{activity.distance > 0 && formatDistance(activity.distance)}</div>
              </div>
              <div className='card-footer'>{activity.type}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarDay;

