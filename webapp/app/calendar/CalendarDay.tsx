"use client";

import React from 'react';
import { getActivityByDate } from '../actions/activities';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import WorkoutModel from '../workouts/WorkoutModel';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { activity as Activity } from '@prisma/client'

type CalendarDayProps = {
  date: Date;
  view?: string;
  setSelectedActivityId: (id: number) => void;
};

function CalendarDay({ date, view, setSelectedActivityId }: CalendarDayProps) {
  const [showWorkoutEditor, setShowWorkoutEditor] = React.useState(false);
  const [activities, setActivities] = React.useState<Activity[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      getActivityByDate(date).then((data) => {
        setActivities(data);
      });
    }
  }, []);

  const selectActivity = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedActivityId(id);
  };

  const addWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWorkoutEditor(true);
  };

  return (
    <div className="card rounded-sm calendar-tile">
      <div className="card-header bg-white flex justify-between">
        <div className="flex gap-2 items-center">
          {date.getDate()}
          <span
            className='btn btn-info btn-icon w-full'
            onClick={addWorkout}>
            <FaPlus />
          </span>
          <WorkoutModel date={date} show={showWorkoutEditor} hide={() => setShowWorkoutEditor(false)} />
        </div>
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
    </div>
  );
}

export default CalendarDay;