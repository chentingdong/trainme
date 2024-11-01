import { modelConfig, StateAnnotation } from '@/app/api/chat/coach/agent';
import { ChatOpenAI } from '@langchain/openai';

export const intentionDetection = async (
  state: typeof StateAnnotation.State
) => {
  const lastUserMessage = state.messages[state.messages.length - 1];
  const model = new ChatOpenAI(modelConfig);
  const conversationResponse = await model.invoke([
    { type: 'system', content: systemTemplate },
    lastUserMessage,
  ]);

  const intentionResponse = await model.invoke([
    { type: 'system', content: intentionDetectionSystemTemplate },
    lastUserMessage,
    { type: 'user', content: intentionDetectionUserTemplate },
  ]);

  const intention = intentionResponse.content;
  console.log('[Intention Detection]: ', intention);

  return {
    messages: intention === 'OTHER' ? [] : [conversationResponse],
    intention,
  };
};

const systemTemplate = `You are a representative of the triathlete training center. You can converse with the user and help them with their questions.`;

const intentionDetectionSystemTemplate = `You are a representative of the triathlete training center. Your role is to identify the user's intentions about making a training plan (WORKOUT_PLANNER), analyzing their past activities and workouts (ACTIVITY_ANALYZER), asking advice about nutrition (NUTRITIONIST) or asking a question (OTHER).`;

const intentionDetectionUserTemplate = `The previous conversation is an interaction between the user and the coach. based on the conversation, determine the user's intention. 

The response should be an enum of the following options:
WORKOUT_PLANNER,
ACTIVITY_ANALYZER,
NUTRITIONIST,
OTHER`;
