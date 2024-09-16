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

  const totalDistance = (workout: Workout): number => {
    return 10;
  };

  const totalDuration = (workout: Workout): number => {
    return 10;
  }

  if (!workout?.workout) {
    return <div>No workout selected</div>;
  }

  return (
    <div className='h-full px-4 flex flex-col justify-between'>
      <div className='px-4 grid grid-cols-4'>
        <div className='col-span-1 flex flex-col justify-start gap-4 px-8'>
        <div className='form-group'>
          <label htmlFor='type'>Type</label>
          <select id='type' className='form-control'>
            <option value='run'>Run</option>
            <option value='ride'>Ride</option>
            <option value='swim'>Swim</option>
          </select>
        </div>
        <div className='form-group'>
            <label htmlFor='workout-distance'>Distance (km)</label>
            <div>{totalDistance(workout)}</div>
        </div>
        <div className='form-group'>
            <label htmlFor='workout-duration'>Duration (minutes)</label>
            <div>{totalDuration(workout)}</div>
        </div>
      </div>
        <div className='col-span-3'>
        <div className='px-8 py-4'>
          <h3 className='h3'>{workout.name}</h3>
          <p>{workout.description}</p>
            <div>
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
        </div>
      </div>
      <div className='flex-grow-0'>
        <WorkoutChart workout={workout} />
      </div>
    </div>
  );
}
