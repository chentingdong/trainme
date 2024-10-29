import { WorkoutPlanner } from '@/app/chat/WorkoutPlanner';
import { Message } from 'ai';

export const StructuredOutput = (props: { message: Message }) => {
  try{
    JSON.parse(props.message.content);
    return <WorkoutPlanner {...props} />;
  } catch {
    return <span>{props.message.content}</span>;
  }
};
