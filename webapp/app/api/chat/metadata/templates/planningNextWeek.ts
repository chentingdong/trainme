import { z } from 'zod';
import defaultWeeklyPlan from '@/app/api/chat/metadata/DefaultWeeklyPlan';

export const planningNextWeekTemplate = `
Some information about my training history in last two weeks:
my current week activities:
{currentWeekActivities}
my current week workouts:
{currentWeekWorkouts}
Input:
{input}
Output should be valid JSON.`;

// TODO: user configurable sport types
const sportTypes = ["Run", "Bike", "Swim", "Strength", "Yoga", "Rest"];

const workoutSchema = () => z.object({
   name: z.string().describe("Name of the workout, in format 'W6D3 - Easy run' as in 6 week to race day, 3rd day of the week, Easy run"),
   sportType: z.enum(sportTypes as [string, ...string[]]).describe("Type of sport in this list."),
   steps: z.array(z.string()).describe(`Steps of the workout, examples are ${defaultWeeklyPlan.map(workout => workout.steps).join(', ')}.`),
   distance: z.number().optional().describe("Total distance of the workout in kilometers"),
   duration: z.number().optional().describe("Total duration of the workout in minutes"),
   date: z.string().describe("Date of the workout in ISO format. It has to be in the time range user asked for, otherwise it will be next week.")
});

export const planningNextWeekSchema = z
   .object({
      chatResponse: z.string().describe("A response to the human's input. in less than 100 words."),
      workouts: z.array(workoutSchema()).optional().describe("A list of 7 to 12 workouts."),
   })
   .describe("Should always be used to properly format output");
