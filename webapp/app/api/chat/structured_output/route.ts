import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { trpc } from '@/app/api/trpc/client';
import defaultWeeklyPlan from '@/data/DefaultWeeklyPlan';
export const runtime = "edge";

const { data: thisWeekActivities } = trpc.activities.getWeeklyActivities.useQuery({
  aday: new Date(),
});
const { data: thisWeekWorkouts } = trpc.workouts.getWeeklyWorkouts.useQuery({
  aday: new Date(),
});


const TEMPLATE = `
${JSON.stringify(thisWeekActivities)}
${JSON.stringify(thisWeekWorkouts)}
Based on this week's workout and activity data, provide personalized coaching advice and recommendations. Consider the following aspects:

1. Analyze the workout history:
   - Look for patterns in frequency, intensity, and types of workouts
   - Identify any gaps or imbalances in the training routine

2. Compare planned workouts with completed activities:
   - Note any discrepancies between planned and actual workouts
   - Suggest adjustments to future plans based on actual performance

3. Provide specific recommendations:
   - Suggest improvements or modifications to the workout plan
   - Offer tips for recovery, nutrition, or technique based on the data

4. Address user questions or concerns:
   - Respond to any specific queries in the input
   - Provide explanations for your recommendations

Format your response as a conversational coaching message, addressing the user directly and providing clear, actionable advice.

Input:

{input}

Output should be valid JSON.`;

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

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * Function calling is currently only supported with ChatOpenAI models
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
    });

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON schema if desired.
     */
    const schema = z
      .object({
        chat_response: z.string().describe("A response to the human's input"),
        workouts: z.array(z.object({
          name: z.string().describe("Name of the workout, short and inspirational"),
          sport: z.enum(["swim", "bike", "run", "strength", "other"]).describe("Type of sport"),
          steps: z.array(z.string()).describe(`Steps of the workout in text encoding format, example ${defaultWeeklyPlan[0].steps}`),
          distance: z.number().optional().describe("Total distance of the workout in kilometers"),
          duration: z.number().optional().describe("Total duration of the workout in minutes"),
          date: z.string().describe("Date of the workout in ISO format")
        })).length(7).describe("A list of 7 workouts, one for each day of the week"),
      })
      .describe("Should always be used to properly format output");

    /**
     * Bind schema to the OpenAI model.
     * Future invocations of the returned model will always match the schema.
     *
     * Under the hood, uses tool calling by default.
     */
    const functionCallingModel = model.withStructuredOutput(schema, {
      name: "output_formatter",
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt.pipe(functionCallingModel);

    const result = await chain.invoke({
      input: currentMessageContent,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
