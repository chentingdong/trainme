import { model, StateAnnotation } from '@/app/api/chat/coach/agent';

export const intentionDetection = async (state: typeof StateAnnotation.State) => {
  const conversationResponse = await model.invoke([
    { type: 'system', content: systemTemplate }, 
    ...state.messages,
  ]);

  const intentionResponse = await model.invoke(
    [
      { type: 'system', content: intentionDetectionSystemTemplate },
      ...state.messages,
      { type: 'user', content: intentionDetectionUserTemplate },
    ]
  );

  console.log('[Intention Detection]: ', intentionResponse.content);

  return {
    messages: conversationResponse,
    intention: intentionResponse.content,
  };
};

const systemTemplate = `You are a representative of the triathlete training center. 

You can converse with the user and help them with their questions, but if they ask about making training plan or analyzing their activities, you should redirect them to the workout planner or activity analyzer respectively.

Otherwise, you should answer conversationally.
`;

const intentionDetectionSystemTemplate = `You are a representative of the triathlete training center. Your role is to identify the user's intentions.`;

const intentionDetectionUserTemplate = `The previous conversation is an interaction between the user and the coach. based on the conversation, determine the user's intention. 

The response should be an enum of the following options:
WORKOUT_PLANNER,
ACTIVITY_ANALYZER,
NUTRITIONIST,
OTHER`;
