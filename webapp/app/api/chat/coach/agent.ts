import { Annotation, END, START } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph } from '@langchain/langgraph';
import { activityAnalyzer } from '@/app/api/chat/coach/activityAnalyzer';
import { intentionDetection } from '@/app/api/chat/coach/intention';
import { BaseMessage } from '@langchain/core/messages';
import { workoutPlannerGraph } from '@/app/api/chat/coach/workoutPlanner';

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),  
  intention: Annotation<string>
});

export const model = new ChatOpenAI({
  temperature: 0.8,
  model: 'gpt-4o-mini',
  maxTokens: 200,
})

// Build the graph
const graph = new StateGraph(StateAnnotation)
  .addNode('intention_detection', intentionDetection)
  .addNode('workout_planner', workoutPlannerGraph)  
  .addNode('activity_analyzer', activityAnalyzer)
  .addEdge(START, 'intention_detection')
  .addConditionalEdges(
    'intention_detection',
    async (state: typeof StateAnnotation.State) => {
      if (state.intention === 'WORKOUT_PLANNER') {
        return 'workout_planner';
      } else if (state.intention === 'ACTIVITY_ANALYZER') {
        return 'activity_analyzer';
      } else {
        return 'conversational';
      }
    },
    {
      workout_planner: 'workout_planner',
      activity_analyzer: 'activity_analyzer',
      conversational: END,
    }
  )
  .addEdge('workout_planner', END)
  .addEdge('activity_analyzer', END)

export const agent = graph.compile();
