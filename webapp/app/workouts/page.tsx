'use client';

import React, { useState } from 'react';
import WorkoutEditor from './WorkoutEditor';
import WorkoutList from './WorkoutList';
import type { workout as Workout } from '@prisma/client';

type Props = {};

export default function page({ }: Props) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  return (
    <div className='grid grid-cols-5 gap-4'>
      <div className='col-span-4 p-4'>
        <WorkoutEditor workout={selectedWorkout} />
      </div>
      <div className='col-span-1 border-l h-full border-blue-200 p-4'>
        <WorkoutList setSelectedWorkout={setSelectedWorkout} />
      </div>
    </div>
  );
}
