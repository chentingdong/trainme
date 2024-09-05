"use client";

import React from 'react';
import { Activity, getActivityFromStravaByDate } from '../actions/activities';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTime, formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/lengthUtils';
import WorkoutEditor from './WorkoutEditor';

type CalendarDayProps = {
  date: Date;
  view?: string;
  setSelectedActivityId: (id: number) => void;
};

function CalendarDay({ date, view, setSelectedActivityId }: CalendarDayProps) {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [showWorkoutEditor, setShowWorkoutEditor] = React.useState(false);

  React.useEffect(() => {
    getActivityFromStravaByDate(date)
      .then((resp) => {
        setActivities(resp);
      })
      .catch((err) => {
        console.error(err);
      });

  }, [date]);

  const selectActivity = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedActivityId(id);
  };

  const addWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('add workout');
  };

  return (
    <div className="card rounded-sm calendar-tile">
      <div className="card-header bg-white flex justify-between">
        <div className="flex gap-2 items-center">
          {date.getDate()}
          <button className='btn btn-info w-full' onClick={() => setShowWorkoutEditor(true)}>+</button>
          <WorkoutEditor date={date} show={showWorkoutEditor} hide={() => setShowWorkoutEditor(false)} />
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
          {activities?.map((activity) => (
            <li key={activity.id} className='card my-1'
              onClick={(e: React.MouseEvent<HTMLLIElement>) => selectActivity(e, activity.id)}>
              <div className='card-header text-sm flex items-center justify-between'>
                <div>{formatTime(activity.start_date_local)}</div>
                <div>{formatTimeSeconds(activity.moving_time)}</div>
              </div>
              <div className='card-body flex justify-between'>
                <div>{activity.type}</div> 
                <div>{activity.distance > 0 && formatDistance(activity.distance)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarDay;