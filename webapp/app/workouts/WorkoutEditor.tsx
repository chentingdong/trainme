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
      <div className='grid grid-cols-3 gap-16 p-4'>
        <div className='col-span-2'>
          <WorkoutChart workout={workout} />
        </div>
        <div className='col-span-1'>
          <h3 className='h3'>Steps</h3>
          {!isEditing &&
            <ul>
              {data.map((step: string, index: number) => (
                <li className='list-decimal my-2' key={index}>
                  <span onClick={handleClick} className='cursor-pointer'>{step}</span>
                </li>
              ))}
            </ul>
          }
          {isEditing &&
            <Textarea className='h-full'
              value={data.join('\n')}
              onChange={handleChange}
              onBlur={handleBlur} />
          }
        </div>
      </div>
    </div>

  );
}