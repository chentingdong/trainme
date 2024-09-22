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
  const { setWorkout: setEditorWorkout } = useWorkout();
  useEffect(() => {
    getWorkoutById(scheduledWorkout.workout_id).then((data) => {
      setWorkout(data);
    });
  }, [scheduledWorkout]);

  const editWorkout = async (workoutId: string) => {
    const result = await getWorkoutById(workoutId);
    setEditorWorkout(result);
  };

  if (!workout) return <Loading />;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center gap-2">
        <div className="flex-grow">{workout.name}</div>
        <button className='btn btn-primary p-1' onClick={() => { editWorkout(workout.id); }}>
          <MdEditCalendar />
        </button>
        <button className='btn btn-danger p-1' onClick={() => deleteScheduledWorkoutById(scheduledWorkout.id)}>
          <MdFreeCancellation />
        </button>
      </div>
      <div className='card-body flex justify-between'></div>
      <div className="h-12 w-full">
        <WorkoutChart workout={workout} />
      </div>
    </div>
  );
};