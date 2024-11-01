import { Annotation, END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { activityAnalyzer } from '@/app/api/chat/coach/activityAnalyzer';
import { intentionDetection } from '@/app/api/chat/coach/intention';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { workoutPlanner } from '@/app/api/chat/coach/workoutPlanner';
import { nutritionist } from '@/app/api/chat/coach/nutritionist';
import { generalCoach } from '@/app/api/chat/coach/generalCoach';

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[] | AIMessage[] | HumanMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  intention: Annotation<string>,
});


export const modelConfig = {
  temperature: 0.8,
  model: 'gpt-4o-mini',
  maxTokens: 400,
};

// Build the graph
const graph = new StateGraph(StateAnnotation)
  .addNode('general_coach', generalCoach)
  .addNode('intention_detection', intentionDetection)
  .addNode('workout_planner', workoutPlanner)
  .addNode('activity_analyzer', activityAnalyzer)
  .addNode('nutritionist', nutritionist)
  .addEdge(START, 'intention_detection')
  .addConditionalEdges(
    'intention_detection',
    async (state: typeof StateAnnotation.State) => {
      switch(state.intention) {
        case 'WORKOUT_PLANNER':
          return 'workout_planner';
        case 'ACTIVITY_ANALYZER':
          return 'activity_analyzer';
        case 'NUTRITIONIST':
          return 'nutritionist';
        default:
          return 'general_coach';
      }
    },
    {
      workout_planner: 'workout_planner',
      activity_analyzer: 'activity_analyzer',
      nutritionist: 'nutritionist',
      general_coach: 'general_coach', 
    }
  )
  .addEdge('general_coach', END)
  .addEdge('workout_planner', END)
  .addEdge('activity_analyzer', END)
  .addEdge('nutritionist', END);

export const agent = graph.compile();

