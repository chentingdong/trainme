import { StateAnnotation } from '@/app/api/chat/coach/agent';

import { modelConfig } from '@/app/api/chat/coach/agent';
import { ChatOpenAI } from '@langchain/openai';

export const generalCoach = async (state: typeof StateAnnotation.State) => {
  const model = new ChatOpenAI(modelConfig);
  const coachResponse = await model.invoke([
    { type: 'system', content: generalCoachTemplate },
    ...state.messages,
  ]);

  return {
    messages: [
      {
        type: 'assistant',
        content: coachResponse.content,
      },
    ],
  };
};
const generalCoachTemplate = `
You are a representative of the triathlete training center. You can handle every other question. You will converse with the user and solve all their questions.`;
