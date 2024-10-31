import { model, StateAnnotation } from '@/app/api/chat/coach/agent';
import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';
import { PromptTemplate } from '@langchain/core/prompts';
import { tool } from '@langchain/core/tools';
import defaultWeeklyPlan from '@/app/api/chat/coach/metadata/DefaultWeeklyPlan';
import { getContextVariable, setContextVariable } from "@langchain/core/context";
import { z } from 'zod';
import { MessagesAnnotation } from '@langchain/langgraph';
import { END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';

export const workoutPlannerTool = tool(
  async () => {
    // Get the current state from the context variable.
    const state = getContextVariable('currentState') as typeof StateAnnotation.State;
    const pastActivities = await getMonthlyActivitiesDB(new Date());
    const pastWorkouts = await getMonthlyWorkoutsDB(new Date());
    const response = await model.invoke([
      {
        type: 'ai',
        content: await PromptTemplate
        .fromTemplate( planningNextWeekTemplate )
        .format({ pastActivities, pastWorkouts }),
      },
      ...state.messages,
    ]);
    return {
      messages: response,
    };
  },
  {
    name: 'workout_planner',
    description: 'Generates a workouts plan.',
  }
);

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const modelWithTools = model.bindTools([workoutPlannerTool]);
  const response = await modelWithTools.invoke([
    {
      type: 'system',
      content: "You are a workout planner. You are given a list of past activities and workouts. You need to generate a workout plan for the next week.",
    },
    ...messages,
  ]);
  return { messages: response };
}

const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  
  if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
      return "tools";
  }
  return END;
}

const toolNodeWithGraphState = async (state: typeof StateAnnotation.State) => {
  // Set a context variable before invoking the tool node and running the tools.
  setContextVariable("currentState", state);
  const toolNodeWithConfig = new ToolNode([workoutPlannerTool]);
  return toolNodeWithConfig.invoke(state);
};

const graph = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addNode('tools', toolNodeWithGraphState)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue, [ 'tools', END])
  .addEdge('tools', 'agent')

export const workoutPlannerGraph = graph.compile();

const planningNextWeekTemplate = `
Some information about my training history in the past:
my past activities:
{pastActivities}
my past workouts:
{pastWorkouts}
Output should be valid JSON.`;

const workoutSchema = () => z.object({
   name: z.string().describe("Name of the workout, in format 'W6D3 - Easy run' as in 6 week to race day, 3rd day of the week, Easy run"),
   sportType: z.enum(sportTypes as [string, ...string[]]).describe("Type of sport in this list."),
   steps: z.array(z.string()).describe(`Steps of the workout, examples are ${defaultWeeklyPlan.map(workout => workout.steps).join(', ')}.`),
   distance: z.number().optional().describe("Total distance of the workout in kilometers"),
   duration: z.number().optional().describe("Total duration of the workout in minutes"),
   date: z.string().describe("Date of the workout in ISO format. It has to be in the time range user asked for, otherwise it will be next week.")
});

// TODO: user configurable sport types
const sportTypes = ["Run", "TrailRun", "Bike", "VirtualRide", "Swim", "WeightTraining", "Yoga", "Rest"];

const planningNextWeekSchema = z
   .object({
      chatResponse: z.string().describe("A response to the human's input. in less than 100 words."),
      workouts: z.array(workoutSchema()).optional().describe("A list of 10 to 15 workouts per week."),
   })
   .describe("Should always be used to properly format output");
