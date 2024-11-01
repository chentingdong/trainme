import React from 'react';
import type { Workout } from '@trainme/db';
import { WorkoutChart } from '@/app/workouts/WorkoutChart';
import { cn } from '@/utils/helper';
import SportIcon from '@/app/activities/SportIcon';
import { useCalendarState } from '@/app/calendar/useCalendarState';

export const WorkoutPlanner: React.FC< {workouts: Workout[]} > = ({workouts}) => {
  const { setWorkout: setEditorWorkout } = useCalendarState();


  return (
    <div className='chat-output'>
      {workouts && workouts.length > 0 && (
        <ul className='workouts my-4'>
          {workouts.map((workout: Workout, index: number) => (
            <li key={index} className='col-span-1 w-full grid grid-cols-6 mb-4'>
              <div className='col-span-1 flex flex-col gap-1'>
                <div>{new Date(workout.date).toLocaleDateString()}</div>
                <div className='text-xs'>
                  {new Date(workout.date).toLocaleString('default', {
                    weekday: 'long',
                  })}
                </div>
              </div>
              <div className='col-span-1 flex flex-col gap-1'>
                <div>{workout.duration}</div>
                <div>{workout.distance}</div>
              </div>
              <div
                className={cn([
                  'card cursor-pointer flex-shrink-0 shadow-md rounded-lg',
                  'text-2xs tracking-tight cursor-pointer',
                  'col-span-3',
                ])}
                onClick={() => workout && setEditorWorkout(workout)}
              >
                <div className='card-header text-2xs flex justify-between items-center gap-2 p-0'>
                  <SportIcon
                    type={workout?.sportType || ''}
                    withColor={true}
                    className='text-yellow-400'
                  />
                  <div className='flex-grow'>{workout?.name}</div>
                </div>
                <div className='card-body'>
                  <div className='h-10 w-full text-2xs'>
                    <WorkoutChart workout={workout || undefined} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

