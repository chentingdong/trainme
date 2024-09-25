"use client";
import React, { useEffect, useState } from 'react';
import { deleteScheduledWorkoutById, getScheduledWorkoutsByDate } from '../actions/schedule';
import { getWorkoutById } from '../actions/workout';
import type { workout as Workout } from '@prisma/client';
import Loading from '../loading';
import WorkoutChart from '../workouts/WorkoutChart';
import { useWorkoutStore } from '@/app/components/useWorkoutStore';
import type { workout_schedule as ScheduledWorkout } from '@prisma/client';
import { cn } from '@/utils/helper';
import ActivityIcon from '../activities/ActivityIcon';
import { IoClose } from "react-icons/io5";

export const CalendarDayWorkout = ({ scheduledWorkout }: { scheduledWorkout: ScheduledWorkout; }) => {
  const [workout, setWorkout] = useState<Workout>();
  const { workout: editorWorkout, setWorkout: setEditorWorkout } = useWorkoutStore();

  useEffect(() => {
    getWorkoutById(scheduledWorkout.workout_id).then((data) => {
      setWorkout(data);
    });
  }, [scheduledWorkout]);

  const handleUnschedule = async () => {
    await deleteScheduledWorkoutById(scheduledWorkout.id);
  };

  if (!workout) return <Loading />;

  return (
    <div
      className={cn(['card cursor-pointer border-2',
        workout.id === editorWorkout?.id ? 'border-yellow-300' : 'border-transparent',
      ])}
      onClick={() => setEditorWorkout(workout)}
    >
      <div className="card-header flex justify-between items-center gap-2 p-0">
        <ActivityIcon type={workout.type} withColor={false} />
        <div className="flex-grow">{workout.name}</div>
        <button className='btn btn-icon btn-danger' onClick={handleUnschedule}>
          <IoClose />
        </button>
      </div>
      <div className='card-body' >
        <div className="h-10 w-full text-2xs">
          <WorkoutChart workout={workout} />
        </div>
      </div>
    </div>
  );
};