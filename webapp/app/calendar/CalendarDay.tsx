"use client";

import React, { useEffect, useState } from 'react';
import ActivityIcon from '../activities/ActivityIcon';
import type { workout as Workout } from '@prisma/client';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { useSchedule } from '../components/ScheduleProvider';
import type { activity as Activity } from '@prisma/client';
import { getActivitiesByDate } from '../actions/activities';
import { useActivity } from '../components/ActivityProvider';
import { useWorkout } from '../components/WorkoutProvider';
import type { workout_schedule as ScheduledWorkout } from '@prisma/client';
import { getScheduledWorkoutsByDate } from '../actions/schedule';
import { getWorkoutById } from '../actions/workout';

type CalendarDayProps = {
  date: Date;
};

function CalendarDay({ date }: CalendarDayProps) {
  // Get activities and workouts of the current schedule date
  const [activities, setActivities] = useState<Activity[]>([]);
  // Selected activity and workout from the current schedule date
  const { activity, setActivity } = useActivity();
  // Selected global workout to show in workout editor
  const { workout, setWorkout } = useWorkout();
  // Scheduled workouts of the current schedule date
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const { scheduleDate, setScheduleDate } = useSchedule();

  useEffect(() => {
    getActivitiesByDate(date).then((data) => {
        setActivities(data);
    });
    getScheduledWorkoutsByDate(date).then((data) => {
      setScheduledWorkouts(data);
    });
  }, [date, setActivities, setScheduledWorkouts]);

  const getWorkoutButtonClass = () => {
    if (!scheduleDate || !date) return '';
    return (
      date.getDate() === scheduleDate.getDate() &&
      date.getMonth() === scheduleDate.getMonth() &&
      date.getFullYear() === scheduleDate.getFullYear()
    ) ? 'selected' : '';
  };

  const editWrokout = async (workoutId: string) => {
    const workout = await getWorkoutById(workoutId);
    setWorkout(workout);
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
          {scheduledWorkouts.map((scheduledWorkout) => (
            <li key={scheduledWorkout.id} className='card'>
              <div className='card-header text-sm flex items-center justify-between'>
                <div>{scheduledWorkout.name}</div>
              </div>
              <button className='btn btn-info' onClick={() => { editWrokout(scheduledWorkout.workout_id); }}>
                {scheduledWorkout?.name || 'No workout selected'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button className={`btn btn-info btn-icon border-none w-full flex gap-4 ${getWorkoutButtonClass()}`}
        onClick={() => setScheduleDate(date)}>
        {format(date, 'EEE')}
        <FaPlus />
      </button>
    </div>
  );
}

export default CalendarDay;