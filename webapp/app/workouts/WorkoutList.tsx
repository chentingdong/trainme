"use client";

import React from 'react';
import { getWorkouts } from '../actions/workout';
import { Button } from 'flowbite-react';
import ActivityIcon from '../activities/ActivityIcon';
import type { workout as Workout } from '@prisma/client';

type Props = {
  selectedWorkout?: Workout;
  setSelectedWorkout: (workout: Workout) => void;
};

export default function WorkoutList({ selectedWorkout, setSelectedWorkout }: Props) {
  const [workouts, setWorkouts] = React.useState<Workout[]>([]);

  React.useEffect(() => {
    getWorkouts().then((workouts) => {
      setWorkouts(workouts);
    });
  }, []);

  const className = (id: number): string => {
    let cn: string = 'btn btn-info flex items-center';
    cn += selectedWorkout?.id === id ? ' border-2' : '';
    return cn;
  }
  return (
    <div>
      <h2 className='h2'>Workouts</h2>
      <div className='flex flex-col justify-start gap-4'>
        <button className='btn btn-info'>+</button>
        {workouts.map(workout => (
          <Button key={workout.id}
            className={className(workout.id)}
            onClick={() => setSelectedWorkout(workout)}>
            <ActivityIcon type={workout.type} />
            <div className='ml-2 font-semibold text-lg'>{workout.name}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}