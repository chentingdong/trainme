import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import defaultWeeklyPlan from '@/app/api/chat/metadata/DefaultWeeklyPlan';
import { getWeeklyActivitiesDB } from '@/server/routes/activities/getWeekly';
import { getWeeklyWorkoutsDB } from '@/server/routes/workouts/getWeekly';
import { planningNextWeekTemplate, schema } from '@/app/api/chat/metadata/templates/planningNextWeek';
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

    // collect two weeks of workout and training data.
    const lastMonday = new Date();
    lastMonday.setDate(lastMonday.getDate() - ((lastMonday.getDay() + 6) % 7));
    const lastWeekActivities = await getWeeklyActivitiesDB(lastMonday);
    let currentWeekActivities = await getWeeklyActivitiesDB(new Date());
    currentWeekActivities = [...currentWeekActivities, ...lastWeekActivities];

    const lastWeekWorkouts = await getWeeklyWorkoutsDB(lastMonday);
    let currentWeekWorkouts = await getWeeklyWorkoutsDB(new Date());
    currentWeekWorkouts = [...currentWeekWorkouts, ...lastWeekWorkouts];

    const activeSports = await getActiveSportTypes();
    const sportTypes = [...new Set(activeSports.map(sport => sport.sportType))];
    const prompt = PromptTemplate.fromTemplate(planningNextWeekTemplate);

    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
    });

    console.log(defaultWeeklyPlan.map(workout => workout.steps).join(', '));
    // Define the output schema

    const functionCallingModel = model.withStructuredOutput(schema(sportTypes), {
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
