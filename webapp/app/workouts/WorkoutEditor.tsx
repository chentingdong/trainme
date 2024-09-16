import React, { ReactElement, useEffect, useState } from 'react';
import WorkoutChart from './WorkoutChart';
import type { workout as Workout } from '@prisma/client';
import { Textarea } from 'flowbite-react';

type Props = {
  workout?: Workout;
};

export default function WorkoutEditor({ workout }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (workout?.workout) {
      setData(JSON.parse(workout.workout));
    }
  }, [workout]);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value.split('\n'));
  };

  const handleBlur = () => {
    setIsEditing(false);
    console.log('save data', data);
  };

  if (!workout?.workout) {
    return <div>No workout selected</div>;
  }

  return (
    <div className='px-4'>
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
      <div className='w-full'>
        <div className='px-8 py-4'>
          <h3 className='h3'>{workout.name}</h3>
          <p>{workout.description}</p>
          <div className="h-128">
            {!isEditing && (
              <ul className='m-0 p-0 h-full border-t'>
              {data.map((step: string, index: number) => (
                <li className='list-inside list-decimal my-2' key={index}>
                  <span onClick={handleClick} className='cursor-pointer'>
                    {step}
                  </span>
                </li>
              ))}
            </ul>
            )}
            {isEditing && (
            <Textarea
                className='bg-auto border border-gray-300 p-8 w-full h-full'
              style={{ lineHeight: '2' }}
                rows={12}
              value={data.join('\n')}
              onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
          </div>
        </div>
        <div>
          <WorkoutChart workout={workout} />
        </div>
        <div className='flex justify-start gap-4'>
          <button className='btn btn-primary'>Save Current</button>
          <button className='btn btn-warning'>Save Workout</button>
          <button className='btn btn-danger'>Delete Workout</button>
          <button className='btn btn-secondary'>Cancel</button>
        </div>
      </div>
    </div>
  );
}
