import { DynamicStructuredTool } from "@langchain/core/tools";
import { planningNextWeekSchema } from "@/app/api/chat/metadata/templates/planningNextWeek";

export const planWorkoutsTool = new DynamicStructuredTool({
  name: "plan_workouts",
  description: "Plans workouts for the next week. response less than 100 words.",
  schema: planningNextWeekSchema,
  func: async ({ chatResponse, workouts }) => {
    console.log(chatResponse, workouts);
  },
});
