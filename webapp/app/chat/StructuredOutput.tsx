import { WorkoutPlanner } from '@/app/chat/WorkoutPlanner';
import { Message } from 'ai';

export const StructuredOutput = (props: { message: Message }) => {
  let parsedContent;
  try{
    parsedContent = JSON.parse(props.message.content);
  } catch {
    console.log('not json');
  }

  if (parsedContent && parsedContent.workouts) {
    return <WorkoutPlanner {...props} />;
  } else {
    return <span>{props.message.content}</span>;
  }
};
