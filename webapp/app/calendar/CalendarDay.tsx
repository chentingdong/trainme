"use client";

import React, { use, useEffect, useState } from 'react';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { useWorkout } from '../components/WorkoutProvider';
import type { activity as Activity } from '@prisma/client';
import { getActivityByDate } from '../actions/activities';

type CalendarDayProps = {
  date: Date;
};

function CalendarDay({ date }: CalendarDayProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [schedule, setSchedule] = useState<Date | null>(null);
  const { workouts } = useWorkout();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getActivityByDate(date).then((data) => {
        setActivities(data);
      });
    }
  }, [date, schedule]);

  const getWorkoutButtonClass = () => {
    if (!schedule) return '';
    return (
      date.getDate() === schedule.getDate() &&
      date.getMonth() === schedule.getMonth() &&
      date.getFullYear() === schedule.getFullYear()
    ) ? 'selected' : '';
  };

  return (
    <div className="card rounded-sm calendar-tile bg-slate-50 dark:bg-gray-900">
      <div className="card-header bg-white flex justify-between">
        <div className="flex gap-2 items-center">
          {date.getDate()}
        </div>
        <div className='flex gap-2'>
          {activities?.map((activity) => (
            <div key={activity.id}>
              <ActivityIcon type={activity.type} />
            </div>
          ))}
        </div>
      </div>
      <div className='py-1 px-0overflow-auto h-56'>
        <ul className="my-1 shadow-sm">
          {activities?.map((activity, index) => (
            <li key={index} className='card my-1'
              onClick={() => setActivity(activity)}>
              <div className='card-header text-sm flex items-center justify-between'>
                <div className='flex items-center' >
                  <ActivityIcon type={activity.type} withColor={false} />
                </div>
                <div>{activity.start_date_local ? format(activity.start_date_local, 'p') : 'Invalid date'}</div>
              </div>
              <div className='card-body flex justify-between'>
                <div>{formatTimeSeconds(activity.moving_time || 0)}</div>
                <div>{(activity.distance ?? 0) > 0 && formatDistance(activity.distance ?? 0)} miles</div>
              </div>
            </li>
          ))}
        </ul>
        <ul>
          {/* {workouts.map((workout) => (
            <li key={workout.id}>
              {workout.name}
            </li>
          ))} */}
        </ul>
      </div>
      <button className={`btn btn-info btn-icon border-none w-full flex gap-4 ${getWorkoutButtonClass()}`}
        onClick={() => setSchedule(date)}>
        {format(date, 'EEE')}
        <FaPlus />
      </button>
    </div>
  );
}

export default CalendarDay;