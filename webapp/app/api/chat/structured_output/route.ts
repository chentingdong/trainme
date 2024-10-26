import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import defaultWeeklyPlan from '@/app/api/chat/metadata/DefaultWeeklyPlan';
import { getWeeklyActivitiesDB } from '@/server/routes/activities/getWeekly';
import { getWeeklyWorkoutsDB } from '@/server/routes/workouts/getWeekly';
import { template as planningNextWeekTemplate } from '@/app/api/chat/metadata/templates/planningNextWeek';
import { getActiveSportTypes } from '@/app/actions/sportType';

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const currentMessageContent = messages[messages.length - 1].content;
    const currentWeekActivities = await getWeeklyActivitiesDB(new Date());
    const currentWeekWorkouts = await getWeeklyWorkoutsDB(new Date());
    const activeSports = await getActiveSportTypes();
    const sportTypes = [...new Set(activeSports.map(sport => sport.sportType))];
    const prompt = PromptTemplate.fromTemplate(planningNextWeekTemplate);

    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
    });
    // Define the output schema
    const workoutSchema = z.object({
      name: z.string().describe("Name of the workout, in format 'W6D3 - Easy run' as in 6 week to race day, 3rd day of the week, Easy run"),
      sportType: z.enum(sportTypes as [string, ...string[]]).describe("Type of sport"),
      steps: z.array(z.string()).describe(`Steps of the workout, example ${defaultWeeklyPlan.map(workout => workout.steps).join(', ')}. Always include warm-up and cool-down at Z1. Every step should have zone and duration data.`),
      distance: z.number().optional().describe("Total distance of the workout in kilometers"),
      duration: z.number().optional().describe("Total duration of the workout in minutes"),
      date: z.string().describe("Date of the workout in ISO format")
    });

    const schema = z
      .object({
        chatResponse: z.string().describe("A response to the human's input. In less than 100 words"),
        workouts: z.array(workoutSchema).length(7).describe("A list of 7 workouts, one for each day of the week"),
      })
      .describe("Should always be used to properly format output");

    const functionCallingModel = model.withStructuredOutput(schema, {
      name: "output_formatter",
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt.pipe(functionCallingModel);

    const result = await chain.invoke({
      input: currentMessageContent,
      currentWeekActivities,
      currentWeekWorkouts,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
