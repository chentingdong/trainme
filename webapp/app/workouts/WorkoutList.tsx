"use client";

import React, { } from 'react';
import { Button } from 'flowbite-react';
import ActivityIcon from '../activities/ActivityIcon';
import { useWorkout } from '../components/WorkoutProvider';

type Props = {
};

export default function WorkoutList({ }: Props) {
  const { workouts, workout, setWorkout } = useWorkout();
  const selected = (id: string) => workout?.id === id ? ' selected' : '';

  return (
    <div>
      <h2 className='h2'>Workouts</h2>
      <div className='flex flex-col justify-start gap-4'>
        <button className='btn btn-info'>+</button>
        {workouts.map(workout => (
          <Button key={workout.id}
            className={`btn btn-info form-controlflex items-center justify-start` + selected(workout.id)}
            onClick={() => setWorkout(workout)}>
            <ActivityIcon type={workout.type} />
            <div className='ml-2 font-semibold text-lg'>{workout.name || 'No name'}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}