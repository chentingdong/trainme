'use client';

import React from 'react';
import WorkoutEditor from './WorkoutEditor';
import WorkoutList from './WorkoutList';

type Props = {};

export default function Page({ }: Props) {

  return (
    <div className='grid grid-cols-5 gap-4'>
      <div className='col-span-4 p-4'>
        <WorkoutEditor />
      </div>
      <div className='col-span-1 border-l h-full border-blue-200 p-4'>
        <WorkoutList />
      </div>
    </div>
  );
}
