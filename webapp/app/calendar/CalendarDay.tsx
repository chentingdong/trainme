"use client";

import React from 'react';
import { Activity, getActivityFromStravaByDate } from '../actions/activities';
import Debug from '@/app/components/Debug';

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
      <div className="card-header">{date.getDate()}</div>
      <div className='card-body h-48'>
        Activity on {date.toLocaleString()}
        {/* <Debug data={activities} /> */}
        <ul>
          {activities.map((activity) => (
            <li key={activity.id} className='card m-2'>
              <div className='card-header flex items-center'>
                <div className='mx-4'>{activity.name}</div>
                <div className='text-sm'>{activity.type}</div>
              </div>
              <div className='card-body'>
                {activity.distance} in {activity.moving_time}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarDay;

