import { generalCoachTemplate } from '@/app/api/chat/metadata/templates/generalCoach';
import { model, StateAnnotation } from '@/app/api/chat/coach/agent';

export const generalCoach = async (state: typeof StateAnnotation.State) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const response = await model.invoke([
    { type: 'system', content: generalCoachTemplate },
    { type: lastMessage._getType(), content: lastMessage.content },
  ]);

  return {
    messages: [
      ...state.messages,
      { type: 'assistant', content: response.content },
    ],
  };
};