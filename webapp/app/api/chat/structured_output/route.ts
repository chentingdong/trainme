import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import defaultWeeklyPlan from '@/app/api/chat/metadata/DefaultWeeklyPlan';
import { getWeeklyActivitiesDB } from '@/server/routes/activities/getWeekly';
import { getWeeklyWorkoutsDB } from '@/server/routes/workouts/getWeekly';
import { planningNextWeekTemplate, planningNextWeekSchema } from '@/app/api/chat/metadata/templates/planningNextWeek';

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
    let pastActivities = await getWeeklyActivitiesDB(new Date());
    pastActivities = [...pastActivities, ...lastWeekActivities];

    const lastWeekWorkouts = await getWeeklyWorkoutsDB(lastMonday);
    let pastWorkouts = await getWeeklyWorkoutsDB(new Date());
    pastWorkouts = [...pastWorkouts, ...lastWeekWorkouts];

    const prompt = PromptTemplate.fromTemplate(planningNextWeekTemplate);

    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4",
    });

    console.log(defaultWeeklyPlan.map(workout => workout.steps).join(', '));
    // Define the output schema

    const functionCallingModel = model.withStructuredOutput(planningNextWeekSchema, {
      name: "output_formatter",
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt.pipe(functionCallingModel);

    const result = await chain.invoke({
      input: currentMessageContent,
      pastActivities,
      pastWorkouts,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
