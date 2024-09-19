"use client";

import React from 'react';
import { getActivityByDate } from '../actions/activities';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { activity as Activity } from '@prisma/client'

type CalendarDayProps = {
  date: Date;
  view?: string;
  setSelectedActivityId?: (id: number) => void;
  workoutDate?: Date;
  setWorkoutDate?: (date: Date) => void;
};

function CalendarDay({ date, view, setSelectedActivityId, workoutDate, setWorkoutDate }: CalendarDayProps) {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      getActivityByDate(date).then((data) => {
        setActivities(data);
      });
    }
  }, [date]);

  const selectActivity = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (setSelectedActivityId)
      setSelectedActivityId(id);
  };

  const getWorkoutButtonClass = () => {
    return (date && workoutDate && date.toDateString() === workoutDate.toDateString()) ? 'selected' : '';
  };

  return (
    <div className="card rounded-sm calendar-tile">
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
      <div className='card-body overflow-auto'>
        <ul className="m-1 shadow-sm">
          {activities?.map((activity, index) => (
            <li key={index} className='card my-1'
              onClick={(e: React.MouseEvent<HTMLLIElement>) => selectActivity(e, activity.id)}>
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
      </div>
      <button className={`btn btn-info btn-icon border-none w-full flex gap-4 ${getWorkoutButtonClass()}`}
        onClick={() => setWorkoutDate && setWorkoutDate(date)}>
        {format(date, 'EEE')}
        <FaPlus />
      </button>
    </div>
  );
}

export default CalendarDay;