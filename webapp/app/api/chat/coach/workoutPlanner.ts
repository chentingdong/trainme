import {
  planningNextWeekSchema,
  planningNextWeekTemplate,
} from '@/app/api/chat/metadata/templates/planningNextWeek';
import { model } from '@/app/api/chat/coach/agent';
import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';
import { PromptTemplate } from '@langchain/core/prompts';
import { tool } from '@langchain/core/tools';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
// Only return ields needed for the workout planner
const ActivitySchema = z.object({
  name: z.string(),
  sportType: z.string(),
  averageSpeed: z.number(),
  averageHeartrate: z.number(),
  averageCadence: z.number(),
  averageWatts: z.number(),
  laps: z.number(),
});

const WorkoutSchema = z.object({
  name: z.string(),
  date: z.string(),
  description: z.string(),
  sportType: z.string(),
  distance: z.number(),
  duration: z.number(),
  feeling: z.string(),
  rpe: z.number(),
  notes: z.string(),
  steps: z.number(),
  activityUuid: z.string(),
});

export const historyRetriever = tool(
  async () => {
    const pastActivities = await getMonthlyActivitiesDB(new Date());
    const pastWorkouts = await getMonthlyWorkoutsDB(new Date());
    console.log('[History Retriever]');
    return { pastActivities, pastWorkouts };
  },
  {
    name: 'history_retriever',
    description: 'Retrieves the past activities and workouts',
  }
);

export const workoutPlanner = tool(
  async ({
    pastActivities,
    pastWorkouts,
    input,
  }: {
    pastActivities: z.infer<typeof ActivitySchema>[];
    pastWorkouts: z.infer<typeof WorkoutSchema>[];
    input: string;
  }) => {
    const response = await model.invoke([
      {
        type: 'ai',
        content: await PromptTemplate.fromTemplate(
          planningNextWeekTemplate
        ).format({
          pastActivities: JSON.stringify(pastActivities),
          pastWorkouts: JSON.stringify(pastWorkouts),
          input,
        }),
      },
    ]);
    return {
      content: planningNextWeekSchema.parse(response.content),
      type: 'assistant',
    };
  },
  {
    name: 'workout_planner',
    description: 'Generates a workouts plan.',
    schema: z.object({
      pastActivities: z.array(ActivitySchema),
      pastWorkouts: z.array(WorkoutSchema),
      input: z.string(),
    }),
  }
);

export const workoutPlannerTools = [historyRetriever, workoutPlanner];
export const workoutPlannerNode = new ToolNode(workoutPlannerTools);

// export const workoutPlanner = async (state: typeof StateAnnotation.State) => {
//   const pastActivities = await getMonthlyActivitiesDB(new Date());
//   const pastWorkouts = await getMonthlyWorkoutsDB(new Date());
//   const lastMessage = state.messages[state.messages.length - 1];
//   const content = await PromptTemplate.fromTemplate(
//     planningNextWeekTemplate
//   ).format({
//     pastActivities: JSON.stringify(pastActivities),
//     pastWorkouts: JSON.stringify(pastWorkouts),
//     input: lastMessage.content,
//   });

//   const workoutPlannerResponse = await model
//     .withStructuredOutput(planningNextWeekSchema, {
//       name: 'workout_planner',
//     })
//     .invoke([
//       { type: 'system', content },
//       { type: lastMessage._getType(), content: lastMessage.content },
//     ]);

//   console.log('Workout planner response: ', workoutPlannerResponse);
//   return {
//     messages: [
//       ...state.messages,
//       {
//         type: 'assistant',
//         content: JSON.stringify(workoutPlannerResponse),
//       },
//     ],
//   };
// };
