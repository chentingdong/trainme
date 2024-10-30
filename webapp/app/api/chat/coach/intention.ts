import { intentionDetectionTemplate } from '@/app/api/chat/metadata/templates/intentionDetection';
import { model, StateAnnotation } from '@/app/api/chat/coach/agent';

export const detectIntention = async (state: typeof StateAnnotation.State) => {
  const lastMessage = state.messages[state.messages.length - 1];

  const categorizationResponse = await model.invoke([
    { type: 'system', content: intentionDetectionTemplate },
    { type: lastMessage.getType(), content: lastMessage.content },
  ]);

  const nextRepresentative = JSON.parse(
    categorizationResponse.content as string
  )?.nextRepresentative;

  console.log('[Intention Detection]: ', nextRepresentative);

  return {
    messages: [...state.messages, {
      content: nextRepresentative,
      type: 'ai',
    }],
  };
};
