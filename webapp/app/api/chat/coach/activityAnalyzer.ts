import { analyzeActivityTemplate } from '@/app/api/chat/metadata/templates/analyzeActivity';
import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';
import { PromptTemplate } from '@langchain/core/prompts';
import { model, StateAnnotation } from '@/app/api/chat/coach/agent';

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
        content: activityAnalyzerResponse.content,
        type: 'assistant',
      },
      { type: lastMessage._getType(), content: lastMessage.content },
    ],
  };
};