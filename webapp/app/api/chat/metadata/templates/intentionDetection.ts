import { z } from 'zod';

export const intentionDetectionTemplate = `You are a representative of the triathlete training center. Your job is to detect whether the user's question is about making training plans, WORKOUT_PLANNER, or asking to analyze activities, ACTIVITY_ANALYZER, or asking about nutrition, NUTRITIONIST. The response should be a JSON object with the following fields: nextRepresentative, whic his either WORKOUT_PLANNER, ACTIVITY_ANALYZER, or NUTRITIONIST.`;

export const intentionDetectionSchema = z.object({
  nextRepresentative: z.enum(["WORKOUT_PLANNER", "ACTIVITY_ANALYZER", "NUTRITIONIST"]),
});