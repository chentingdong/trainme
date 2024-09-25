'use client';

import React, { useEffect } from 'react';
import { Button } from 'flowbite-react';
import ActivityIcon from '../activities/ActivityIcon';
import { useWorkout } from '../components/WorkoutProvider';
import { getWorkouts } from '../actions/workout';
import { emptyWorkout } from '@/prisma';
import { FiPlus } from 'react-icons/fi';

type Props = {};

export default function WorkoutList({ }: Props) {
  const { workouts, setWorkouts, workout, setWorkout } = useWorkout();
  const selected = (id: string) => (workout?.id === id ? ' selected' : '');
  useEffect(() => {
    getWorkouts().then(setWorkouts);
  }, []);

  const handleNewWorkout = () => {
    setWorkout(emptyWorkout);
  };

  return (
    <div className='h-full overflow-auto flex flex-col justify-start gap-2'>
      <h2 className='h2'>Workouts</h2>
      <button className='btn btn-info text-center' onClick={handleNewWorkout}>
        <FiPlus />
      </button>
      {workouts.map((workout) => (
        <Button
          key={workout.id}
          className={
            `btn btn-info p-0 flex items-center justify-start` +
            selected(workout.id)
          }
          onClick={() => setWorkout(workout)}
        >
          <ActivityIcon type={workout.type} />
          <div className='ml-2 font-semibold text-md'>
            {workout.name || 'No name'}
          </div>
        </Button>
      ))}
    </div>
  );
}
