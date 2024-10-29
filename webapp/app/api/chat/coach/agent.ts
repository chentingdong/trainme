import { Annotation } from '@langchain/langgraph';
import { MessagesAnnotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph } from '@langchain/langgraph';
import { activityAnalyzer } from '@/app/api/chat/coach/activityAnalyzer';
import { generalCoach } from '@/app/api/chat/coach/generalCoach';
import { detectIntention } from '@/app/api/chat/coach/intention';
import { workoutPlanner } from '@/app/api/chat/coach/workoutPlanner';

export const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  nextRepresentative: Annotation<string>,
  refundAuthorized: Annotation<boolean>,
});

export const model = new ChatOpenAI({
  temperature: 0.8,
  model: 'gpt-4o-mini',
  maxTokens: 500,
});

// Build the graph
const graph = new StateGraph(StateAnnotation)
  .addNode('detect_intention', detectIntention)
  .addEdge('__start__', 'detect_intention')
  .addNode('workout_planner', workoutPlanner)
  .addNode('activity_analyzer', activityAnalyzer)
  .addNode('general_coach', generalCoach)
  .addConditionalEdges(
    'detect_intention',
    async (state: typeof StateAnnotation.State) => {
      if (state.nextRepresentative.includes('WORKOUT_PLANNER')) {
        return 'workout_planner';
      } else if (state.nextRepresentative.includes('ACTIVITY_ANALYZER')) {
        return 'activity_analyzer';
      } else {
        return 'general_coach';
      }
    },
    {
      workout_planner: 'workout_planner',
      activity_analyzer: 'activity_analyzer',
      general_coach: 'general_coach',
    }
  )
  .addEdge('workout_planner', '__end__')
  .addEdge('activity_analyzer', '__end__')
  .addEdge('general_coach', '__end__');

export const agent = graph.compile();
