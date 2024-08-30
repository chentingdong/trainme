"use client";

import React from 'react';
import { Activity, getActivityFromStravaByDate } from '../actions/activities';
import Debug from '@/app/components/Debug';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTime, formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/lengthUtils';

type CalendarDayProps = {
  date: Date;
  view?: string;
};

function CalendarDay({ date }: CalendarDayProps) {
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
      <div className="card-header bg-white">{date.getDate()}</div>
      <div className='h-auto'>
        <ul className="m-1 shadow-sm">
          {activities.map((activity) => (
            <li key={activity.id} className='card my-1'>
              <div className='card-header text-sm flex items-center'>
                <ActivityIcon type={activity.type} />
                <div className='ml-2'>{formatTime(activity.start_date)}</div>
              </div>
              <div className='card-body'>
                <div > {formatTimeSeconds(activity.moving_time)}</div>
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

