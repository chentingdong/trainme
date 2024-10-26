import { Message } from 'ai';
import React from 'react';
import type { Workout } from '@trainme/db';
import { WorkoutChart } from '@/app/workouts/WorkoutChart';
import Debug from '@/app/components/Debug';

const ChatOutputWorkout: React.FC<{ message: Message; }> = (props) => {
  const { chatResponse, workouts } = JSON.parse(props.message.content);

  return (
    <div className="chat-output">
      <div className="chat-response">
        <p>{chatResponse}</p>
      </div>
      {workouts && workouts.length > 0 && (
        <div className="workouts">
          <h2>Weekly Workouts:</h2>
          {workouts.map((workout: Workout, index: number) => (
            <>
              <Debug key={index} data={workout} />
              <WorkoutChart key={index} workout={workout} />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatOutputWorkout;
