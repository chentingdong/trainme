import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';
import { PromptTemplate } from '@langchain/core/prompts';
import { modelConfig, StateAnnotation } from '@/app/api/chat/coach/agent';
import { ChatOpenAI } from '@langchain/openai';

export const activityAnalyzer = async (state: typeof StateAnnotation.State) => {
  const pastActivities = await getMonthlyActivitiesDB(new Date());
  const pastWorkouts = await getMonthlyWorkoutsDB(new Date());
  const lastMessage = state.messages[state.messages.length - 1];

  const content = await PromptTemplate.fromTemplate(
    analyzeActivityTemplate
  ).format({
    pastActivities: JSON.stringify(pastActivities),
    pastWorkouts: JSON.stringify(pastWorkouts),
    input: lastMessage.content,
  });

  const model = new ChatOpenAI(modelConfig);
  const activityAnalyzerResponse = await model.invoke([
    {
      type: 'system',
      content,
    },
    {
      type: 'user',
      content: 'Please help me analyze my training activities.',
    },
  ]);

  console.log('Activity analyzer response: ', activityAnalyzerResponse);

  return {
    messages: [
      {
        type: 'assistant',
        content: activityAnalyzerResponse.content,
      }
    ],
  };
};

export const analyzeActivityTemplate = `You are geneous triathlete coach. Your job is to analyze the user's actural activities and plannedworkouts and provide a summary of the user's training. 
my past training activities:
{pastActivities}
my past training workouts:
{pastWorkouts}
Input:
{input}
Output should be in less than 100 words. bullet points are preferred, very short sentences are also preferred.
`;

