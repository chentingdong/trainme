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
      <div className='h-full w-full flex flex-col justify-between'>
        <div className='px-8 py-4'>
          <h3 className='h3'>Steps</h3>
          {!isEditing &&
            <ul className='m-0 p-0'>
              {data.map((step: string, index: number) => (
                <li className='list-inside list-decimal my-2' key={index}>
                  <span onClick={handleClick} className='cursor-pointer'>{step}</span>
                </li>
              ))}
            </ul>
          }
          {isEditing &&
            <Textarea
              rows={15}
              style={{ lineHeight: '2' }}
              className='bg-auto border border-gray-300 p-2 w-full'
              value={data.join('\n')}
              onChange={handleChange}
              onBlur={handleBlur} />
          }
        </div>
        <div>
          <WorkoutChart workout={workout} />
        </div>
      </div>
    </div>

  );
}