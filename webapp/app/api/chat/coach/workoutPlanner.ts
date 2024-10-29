import { planningNextWeekSchema, planningNextWeekTemplate } from '@/app/api/chat/metadata/templates/planningNextWeek';
import { model, StateAnnotation } from '@/app/api/chat/coach/agent';
import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';
import { PromptTemplate } from '@langchain/core/prompts';

export const workoutPlanner = async (state: typeof StateAnnotation.State) => {
  const pastActivities = await getMonthlyActivitiesDB(new Date());
  const pastWorkouts = await getMonthlyWorkoutsDB(new Date());
  const lastMessage = state.messages[state.messages.length - 1];
  const content = await PromptTemplate.fromTemplate(
    planningNextWeekTemplate
  ).format({
    pastActivities: JSON.stringify(pastActivities),
    pastWorkouts: JSON.stringify(pastWorkouts),
    input: lastMessage.content,
  });

  const workoutPlannerResponse = await model
    .withStructuredOutput(planningNextWeekSchema, {
      name: 'workout_planner',
    })
    .invoke([
      { type: 'system', content },
      { type: lastMessage._getType(), content: lastMessage.content },
    ]);

  console.log('Workout planner response: ', workoutPlannerResponse);
  return {
    messages: [
      ...state.messages,
      {
        type: 'assistant',
        content: JSON.stringify(workoutPlannerResponse),
      },
    ],
  };
};
