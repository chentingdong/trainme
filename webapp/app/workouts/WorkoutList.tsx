"use client";

import React from 'react';
import { getWorkouts } from '../actions/workout';
import { Card } from 'flowbite-react';
import type { WorkoutWithSteps } from '@/utils/types';

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
          <Card key={workout.id} className='p-4 mb-4 cursor-pointer' onClick={() => setSelectedWorkout(workout)}>
            <h3>{workout.name}</h3>
            <p>{workout.type}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}