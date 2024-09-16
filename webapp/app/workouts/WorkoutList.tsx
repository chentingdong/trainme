"use client";

import React from 'react';
import { getWorkouts } from '../actions/workout';
import { Button } from 'flowbite-react';
import type { WorkoutWithSteps } from '@/utils/types';
import ActivityIcon from '../activities/ActivityIcon';

type Props = {
  setSelectedWorkout: (workout: WorkoutWithSteps) => void;
};

export default function WorkoutList({ setSelectedWorkout }: Props) {
  const [workouts, setWorkouts] = React.useState<WorkoutWithSteps[]>([]);

  React.useEffect(() => {
    getWorkouts().then((workouts) => {
      setWorkouts(workouts);
    });
  }, []);

  return (
    <div>
      <h2>Workouts</h2>
      <div className='flex justify-between'>
        {workouts.map(workout => (
          <Button key={workout.id}
            className='flex items-center bg-yellow-400 dark:bg-gray-800 dark:text-white'
            onClick={() => setSelectedWorkout(workout)}>
            <ActivityIcon type={workout.type} />
            <div className='ml-2 font-semibold text-lg'>{workout.name}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}