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
    <div className='h-full gap-1 px-2 overflow-y-auto scroll'>
      <div className="col-span-2 flex justify-between items-center">
        <h3 className='h3'>Workouts</h3>
        <button className='btn btn-icon text-center' onClick={handleNewWorkout}>
          <FiPlus />
        </button>
      </div>
      <div className='grid grid-cols-2 gap-1'>
      {workouts.map((workout) => (
        <Button
          key={workout.id}
          className={
            `col-span-2 btn btn-info p-0 flex items-center justify-start` +
            selected(workout.id)
          }
          onClick={() => setWorkout(workout)}
        >
          <ActivityIcon type={workout.type} />
          <div className='ml-2 font-semibold text-sm'>
            {workout.name || 'No name'}
          </div>
        </Button>
      ))}
      </div>
    </div>
  );
}
