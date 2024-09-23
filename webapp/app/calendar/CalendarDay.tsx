"use client";

import React, { useEffect, useState } from 'react';
import ActivityIcon from '../activities/ActivityIcon';

import { PiPaperPlaneFill } from "react-icons/pi";
import { format } from 'date-fns';
import { useSchedule } from '../components/ScheduleProvider';
import type { activity as Activity } from '@prisma/client';
import { getActivitiesByDate } from '../actions/activities';
import { useActivity } from '../components/ActivityProvider';
import type { workout_schedule as ScheduledWorkout } from '@prisma/client';
import { getScheduledWorkoutsByDate } from '../actions/schedule';
import { CalendarDayWorkout } from './CalendarDayWorkout';
import { CalendarDayActivity } from './CalendarDayActivity';

type CalendarDayProps = {
  date: Date;
};

function CalendarDay({ date }: CalendarDayProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { setActivity } = useActivity();
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const { scheduleDate, setScheduleDate } = useSchedule();

  useEffect(() => {
    getActivitiesByDate(date).then((data) => {
      setActivities(data);
    });
  }, [date, setActivities]);

  useEffect(() => {
    getScheduledWorkoutsByDate(date).then((data) => {
      setScheduledWorkouts(data);
    });
  }, [date, scheduleDate, setScheduledWorkouts]);

  const workoutButtonStyle: string = (() => {
    let cn = 'btn btn-info btn-icon border-none w-full';
    cn += ' flex gap-4 items-center justify-center';
    cn += date?.getDate() === scheduleDate?.getDate() ? ' active' : '';
    return cn;
  })();

  return (
    <div className="card rounded-sm calendar-tile overflow-y-visible">
      <div className="card-header flex justify-between">
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
      <div className='py-1 px-0 overflow-auto h-56'>
        <ul className="my-1 shadow-sm">
          {activities?.map((activity, index) => (
            <li key={index} className='card my-1'
              onClick={() => setActivity(activity)}>
              <CalendarDayActivity activity={activity} />
            </li>
          ))}
        </ul>
        <ul>
          {scheduledWorkouts?.map((scheduledWorkout) => (
            <li key={scheduledWorkout.id}>
              <CalendarDayWorkout scheduledWorkout={scheduledWorkout} />
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer px-4 py-1">
        <button className={workoutButtonStyle} onClick={() => setScheduleDate(date)}>
          {format(date, 'EEEE')}
          <PiPaperPlaneFill width={200} />
        </button>
      </div>
    </div>
  );
}

export default CalendarDay;