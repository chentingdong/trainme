import { z } from 'zod';
import defaultWeeklyPlan from '@/app/api/chat/metadata/DefaultWeeklyPlan';

export const planningNextWeekTemplate = `
Some information about my training history in last two weeks:
my current week activities:
{currentWeekActivities}
my current week workouts:
{currentWeekWorkouts}

If the user asks to analyze history data, provide personalized coaching advice and recommendations. Consider the following aspects:

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

Format your response as if a coach will write on a blackboard, very pricise, bullet points, no intro, no conclusion. less than 100 words in total.

If the user asks to make a plan for the next week, please make the plan in continuous with previous workouts, with less than 10% increase of total time. Workout frequency should not change much. match the intensity pattern by the day of the week.

The format of your plan should be very precise, the steps are arrays of strings, each string must have zone info (as in Z2, Z3 etc), and a time (as either in 2m for two minutes, 1h for one hour, or both h and m).
You should plan for multiple workouts per day to cover the total hour.
Input:

If the user provide race day target, count back in weeks to adjust the weekly training plan.
{input}

Output should be valid JSON.`;


const workoutSchema = (sportTypes: string[]) => z.object({
   name: z.string().describe("Name of the workout, in format 'W6D3 - Easy run' as in 6 week to race day, 3rd day of the week, Easy run"),
   sportType: z.enum(sportTypes as [string, ...string[]]).describe("Type of sport"),
   steps: z.array(z.string()).describe(`Steps of the workout, examples are ${defaultWeeklyPlan.map(workout => workout.steps).join(', ')}.`),
   distance: z.number().optional().describe("Total distance of the workout in kilometers"),
   duration: z.number().optional().describe("Total duration of the workout in minutes"),
   date: z.string().describe("Date of the workout in ISO format")
});

// Use workoutSchema correctly in the schema definition
export const schema = (sportsTypes: string[]) => z
   .object({
      chatResponse: z.string().describe("A response to the human's input."),
      workouts: z.array(workoutSchema(sportsTypes)).optional().describe("A list of 7 to 12 workouts, you can have one or two workouts each day. If the user didn't ask for creating workouts for next week, leave it empty."),
   })
   .describe("Should always be used to properly format output");
