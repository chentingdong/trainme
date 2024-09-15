import React from 'react';
import WorkoutChart from './WorkoutChart';
import type { workout as Workout } from '@prisma/client';

type Props = {
  workout?: Workout;
};

export default function WorkoutEditor({ workout }: Props) {
  // save to overwrite existing workout
  // save as new workout

  if (!workout) {
    return <div>No workout selected</div>;
  }

  return (
    <div>
      <div className='flex justify-between gap-4'>
        <div className='form-group'>
          <label htmlFor='type'>Type</label>
          <select id='type' className='form-control'>
            <option value='run'>Run</option>
            <option value='ride'>Ride</option>
            <option value='swim'>Swim</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='workout-distance'>Distance</label>
          <input id='workout-distance' type='number' className='form-control' />
        </div>
        <div className='form-group'>
          <label htmlFor='workout-duration'>Duration</label>
          <input id='workout-duration' type='time' className='form-control' />
        </div>
      </div>
      <WorkoutChart workout={workout} />
    </div>

  );
}