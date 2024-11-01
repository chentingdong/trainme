import { StateAnnotation } from '@/app/api/chat/coach/agent';

import { modelConfig } from '@/app/api/chat/coach/agent';
import { ChatOpenAI } from '@langchain/openai';

export const nutritionist = async (state: typeof StateAnnotation.State) => {
  const model = new ChatOpenAI(modelConfig);
  const nutritionistResponse = await model.invoke([
    { type: 'system', content: systemTemplate },
    ...state.messages,
  ]);

  return {
    messages: [
      {
        type: 'assistant',
        content: nutritionistResponse.content,
      },
    ],
  };
};

const systemTemplate = `You are a nutritionist at the triathlete training center. You can help the user with their nutrition questions.`;