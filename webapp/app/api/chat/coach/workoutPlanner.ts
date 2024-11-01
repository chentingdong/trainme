import { ChatOpenAI } from '@langchain/openai';
import { getMonthlyDb as getMonthlyActivitiesDB } from '@/server/routes/activities/getMonthly';
import { getMonthlyDb as getMonthlyWorkoutsDB } from '@/server/routes/workouts/getMonthly';
import { PromptTemplate } from '@langchain/core/prompts';
import defaultWeeklyPlan from '@/app/api/chat/coach/metadata/DefaultWeeklyPlan';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { MessagesAnnotation } from '@langchain/langgraph';

export const workoutPlanner = async (
  state: typeof MessagesAnnotation.State
) => {
  const pastActivities = await getMonthlyActivitiesDB(new Date());
  const pastWorkouts = await getMonthlyWorkoutsDB(new Date());
  const content = await PromptTemplate.fromTemplate(
    planningNextWeekTemplate
  ).format({
    pastActivities: JSON.stringify(pastActivities),
    pastWorkouts: JSON.stringify(pastWorkouts),
    defaultWeeklyPlan: JSON.stringify(defaultWeeklyPlan),
    schema: JSON.stringify(zodToJsonSchema(planningNextWeekSchema)),
  });

  const model = new ChatOpenAI({
    temperature: 0.8,
    model: 'gpt-4o-mini',
    maxTokens: 2500,
  });
  
  const response = await model
    .invoke([
      { type: 'system', content },
      ...state.messages,
    ]);

  return {
    messages: [{
      type: 'assistant',
      content: response.content,
    }],
  };
};

const workoutSchema = () =>
  z.object({
    name: z
      .string()
      .describe(
        "Name of the workout, in format 'W6D3 - Easy run' as in 6 week to race day, 3rd day of the week, Easy run"
      ),
    sportType: z
      .enum(sportTypes as [string, ...string[]])
      .describe('Type of sport in this list.'),
    steps: z
      .array(z.string())
      .describe(
        `Steps of the workout, examples are ${defaultWeeklyPlan.map((workout) => workout.steps).join(', ')}.`
      ),
    distance: z
      .number()
      .optional()
      .describe('Total distance of the workout in kilometers'),
    duration: z
      .number()
      .optional()
      .describe('Total duration of the workout in minutes'),
    date: z
      .string()
      .describe(
        'Date of the workout in ISO format. It has to be in the time range user asked for, otherwise it will be next week.'
      ),
  });

// TODO: user configurable sport types
const sportTypes = [
  'Run',
  'TrailRun',
  'Bike',
  'VirtualRide',
  'Swim',
  'WeightTraining',
  'Yoga',
  'Rest',
];

const planningNextWeekSchema = z
  .object({
    chatResponse: z
      .string()
      .describe("A response to the human's input. in less than 100 words."),
    workouts: z
      .array(workoutSchema())
      .optional()
      .describe('A list of 10 to 15 workouts per week.'),
  })
  .describe('Should always be used to properly format output');

const planningNextWeekTemplate = `
Some information about my training history in the past:
my past activities:
{pastActivities}
my past workouts:
{pastWorkouts}

Please create my future workouts following the format:

{defaultWeeklyPlan}

Each workout should have steps, distance, duration, and date. 
Each step should be a string with a number and a unit, for example "30 minutes", "5 km", "40 minutes", "400 meters".

**Important Instructions:**

- Output **only** the JSON data that matches the schema below.
- Do **not** include any explanations, descriptions, or additional text.
- Do **not** enclose the JSON in code blocks or quotes.

Schema:
{schema}
`;