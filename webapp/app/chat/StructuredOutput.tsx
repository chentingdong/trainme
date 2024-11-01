import { WorkoutPlanner } from '@/app/chat/WorkoutPlanner';
import Debug from '@/app/components/Debug';
import { Message } from 'ai';

export const StructuredOutput = (props: { message: Message }) => {
  try{
    const parsedContent = JSON.parse(props.message.content);
    console.log(parsedContent);
    return (
      <div>
        <span>{parsedContent.chatResponse}</span>
        <WorkoutPlanner workouts={parsedContent.workouts} />
      </div>
    )
  } catch {
    return <span>{props.message.content}</span>;
  }
};
