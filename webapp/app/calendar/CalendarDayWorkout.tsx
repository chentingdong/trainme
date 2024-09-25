"use client";
import React, { useEffect, useState } from 'react';
import { deleteScheduledWorkoutById, getScheduledWorkoutsByDate } from '../actions/schedule';
import { getWorkoutById } from '../actions/workout';
import { MdFreeCancellation } from "react-icons/md";
import { MdEditCalendar } from "react-icons/md";
import type { workout as Workout } from '@prisma/client';
import Loading from '../loading';
import WorkoutChart from '../workouts/WorkoutChart';
import { useWorkout } from '../components/WorkoutProvider';
import type { workout_schedule as ScheduledWorkout } from '@prisma/client';

export const CalendarDayWorkout = ({ scheduledWorkout }: { scheduledWorkout: ScheduledWorkout; }) => {
  const [workout, setWorkout] = useState<Workout>();
  const { workout: editorWorkout, setWorkout: setEditorWorkout } = useWorkout();

  useEffect(() => {
    getWorkoutById(scheduledWorkout.workout_id).then((data) => {
      setWorkout(data);
    });
  }, [scheduledWorkout]);

  const handleEditWorkout = async (workoutId: string) => {
    const result = await getWorkoutById(workoutId);
    setEditorWorkout(result);
  };

  const handleUnschedule = async () => {
    await deleteScheduledWorkoutById(scheduledWorkout.id);
  };

  if (!workout) return <Loading />;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center gap-2 p-0">
        <div className="flex-grow">{workout.name}</div>
        <button className='btn btn-primary p-1' onClick={() => { handleEditWorkout(workout.id); }}>
          <MdEditCalendar />
        </button>
        <button className='btn btn-danger p-1' onClick={handleUnschedule}>
          <MdFreeCancellation />
        </button>
      </div>
      <div className={
        `card-body  border-2` +
          workout.id === editorWorkout?.id ? 'border-yellow-300' : 'border-transparent'
      }>
        <div className="p-0 h-10 w-full text-2xs" onClick={() => setEditorWorkout(workout)}>
          <WorkoutChart workout={workout} />
        </div>
      </div>
    </div>
  );
};