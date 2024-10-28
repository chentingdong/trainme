import { Message } from 'ai';
import React from 'react';
import type { Workout } from '@trainme/db';
import { WorkoutChart } from '@/app/workouts/WorkoutChart';
import { cn } from '@/utils/helper';
import { useCalendarState } from '@/app/calendar/useCalendarState';
import SportIcon from '@/app/activities/SportIcon';

const ChatOutputWorkout: React.FC<{ message: Message }> = (props) => {
  let chatResponse, workouts;

  try {
    const parsedContent = JSON.parse(props.message.content);
    chatResponse = parsedContent.chatResponse;
    workouts = parsedContent.workouts;
  } catch (error) {
    console.error('Failed to parse message content:', error);
    // Handle the error appropriately, e.g., set default values or show an error message
  }

  const { setWorkout: setEditorWorkout } = useCalendarState();

  return (
    <div className='chat-output'>
      <div className='chat-response font-ai'>{chatResponse}</div>
      {workouts && workouts.length > 0 && (
        <ul className='workouts grid grid-cols-3 gap-4 my-4'>
          {workouts.map((workout: Workout, index: number) => (
            <li key={index} className='col-span-1'>
              <div
                className={cn([
                  'card cursor-pointer flex-shrink-0 shadow-md rounded-lg',
                  'text-2xs tracking-tight cursor-pointer',
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

export default ChatOutputWorkout;
