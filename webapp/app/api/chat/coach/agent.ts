import { planningNextWeekTemplate } from '@/app/api/chat/metadata/templates/planningNextWeek';
import { Annotation } from '@langchain/langgraph';
import { MessagesAnnotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph } from '@langchain/langgraph';
import { planningNextWeekSchema } from '@/app/api/chat/metadata/templates/planningNextWeek';
import { intentionDetectionTemplate } from '@/app/api/chat/metadata/templates/intentionDetection';
import { PromptTemplate } from '@langchain/core/prompts';
import { analyzeActivityTemplate } from '@/app/api/chat/metadata/templates/analyzeActivity';
import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';

const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  nextRepresentative: Annotation<string>,
  refundAuthorized: Annotation<boolean>,
});
const model = new ChatOpenAI({
  temperature: 0.8,
  model: 'gpt-4o-mini',
  maxTokens: 500,
});

const detectIntention = async (state: typeof StateAnnotation.State) => {
  const lastMessage = state.messages[state.messages.length - 1];

  const categorizationResponse = await model.invoke([
    { type: 'system', content: intentionDetectionTemplate },
    { type: lastMessage._getType(), content: lastMessage.content },
  ]);

  const categorizationOutput = JSON.parse(
    categorizationResponse.content as string
  );

  console.log('Intention detected: ', categorizationOutput.nextRepresentative);

  return {
    messages: state.messages,
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
};

const workoutPlanner = async (state: typeof StateAnnotation.State) => {
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
      {
        type: 'user',
        content: 'Please help me plan my next week of workouts.',
      },
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

const activityAnalyzer = async (state: typeof StateAnnotation.State) => {
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
      ...state.messages,
      {
        content: activityAnalyzerResponse.content,
        type: 'assistant',
      },
    ],
  };
};

// Build the graph
const graph = new StateGraph(StateAnnotation)
  .addNode('detect_intention', detectIntention)
  .addNode('workout_planner', workoutPlanner)
  .addNode('activity_analyzer', activityAnalyzer)
  .addEdge('__start__', 'detect_intention')
  .addConditionalEdges(
    'detect_intention',
    async (state: typeof StateAnnotation.State) => {
      if (state.nextRepresentative.includes('WORKOUT_PLANNER')) {
        return 'workout_planner';
      } else if (state.nextRepresentative.includes('ACTIVITY_ANALYZER')) {
        return 'activity_analyzer';
      } else {
        return 'conversational';
      }
    },
    {
      workout_planner: 'workout_planner',
      activity_analyzer: 'activity_analyzer',
      conversational: '__end__',
    }
  )
  .addEdge('workout_planner', '__end__')
  .addEdge('activity_analyzer', '__end__');

export const agent = graph.compile();
