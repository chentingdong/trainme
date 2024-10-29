import { z } from 'zod';

export const intentionDetectionTemplate = `You are a representative of the triathlete training center. Your role is to identify the user's inquiry, which may pertain to creating training plans (WORKOUT_PLANNER), analyzing activities (ACTIVITY_ANALYZER), discussing nutrition (NUTRITIONIST), or other topics. Regardless of the input, always respond with a JSON object containing the field: nextRepresentative, most cases it should be OTHER.
INPUT:
{input}
`;

export const intentionDetectionSchema = z.object({
  nextRepresentative: z.enum(["WORKOUT_PLANNER", "ACTIVITY_ANALYZER", "NUTRITIONIST", "OTHER"]),
});