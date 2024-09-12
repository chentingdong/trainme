"use client";

import React from 'react';
import { Activity, getActivityFromStravaByDate } from '../actions/activities';
import ActivityIcon from '../activities/ActivityIcon';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import WorkoutEditor from './WorkoutEditor';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';


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
          <span
            className='btn btn-info btn-icon w-full'
            onClick={() => setShowWorkoutEditor(true)}>
            <FaPlus />
          </span>
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
                <div className='flex items-center'>
                  <ActivityIcon type={activity.type} withColor={false} />
                  {activity.type}
                </div>
                <div>{format(activity.start_date_local, 'p')}</div>
              </div>
              <div className='card-body flex justify-between'>
                <div>{formatTimeSeconds(activity.moving_time)}</div>
                <div>{activity.distance > 0 && formatDistance(activity.distance)} miles</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarDay;