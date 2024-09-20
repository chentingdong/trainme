"use client";

import React, { use, useEffect, useState } from 'react';
import { getWorkouts } from '../actions/workout';
import { Button } from 'flowbite-react';
import ActivityIcon from '../activities/ActivityIcon';
import type { workout as Workout } from '@prisma/client';
import { defaultWorkout } from '@/prisma';

type Props = {
};

export default function WorkoutList({ }: Props) {
  const [workouts, setWorkouts] = React.useState<Workout[]>([]);
  useEffect(() => {
    getWorkouts().then(setWorkouts);
  }, []);

  const [workout, setWorkout] = React.useState<Workout>(defaultWorkout);

  return (
    <div>
      <h2 className='h2'>Workouts</h2>
      <div className='flex flex-col justify-start gap-4'>
        <button className='btn btn-info'>+</button>
        {workouts.map(workout => (
          <Button key={workout.id}
            className='btn btn-info flex items-center'
            onClick={() => setWorkout(workout)}>
            <ActivityIcon type={workout.type} />
            <div className='ml-2 font-semibold text-lg'>{workout.name || 'No name'}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}