'use client';

import React, { useState } from 'react';
import WorkoutEditor from './WorkoutEditor';
import WorkoutList from './WorkoutList';
import type { workout as Workout } from '@prisma/client';
import { defaultWorkout } from '@/prisma';

type Props = {};

export default function page({ }: Props) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>(defaultWorkout);

  return (
    <div className='grid grid-cols-5 gap-4'>
      <div className='col-span-4 p-4'>
        {selectedWorkout && <WorkoutEditor workout={selectedWorkout} setWorkout={setSelectedWorkout} />}
      </div>
      <div className='col-span-1 border-l h-full border-blue-200 p-4'>
        <WorkoutList setSelectedWorkout={setSelectedWorkout} />
      </div>
    </div>
  );
}
