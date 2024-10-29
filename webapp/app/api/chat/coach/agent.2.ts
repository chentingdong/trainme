// agent.ts

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { ChatOpenAI } from '@langchain/openai';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StateGraph } from '@langchain/langgraph';
import { MessagesAnnotation } from '@langchain/langgraph'; // Ensure this import is present
import { getWeeklyActivitiesDB } from '@/server/routes/activities/getWeekly';
import { getWeeklyWorkoutsDB } from '@/server/routes/workouts/getWeekly';
import { planningNextWeekSchema } from '@/app/api/chat/metadata/templates/planningNextWeek';
import { planningNextWeekTemplate } from '@/app/api/chat/metadata/templates/planningNextWeek';
import { PromptTemplate } from '@langchain/core/prompts';

// Define the tools for the agent to use
const tools = [new TavilySearchResults({ maxResults: 1 })];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.8,
  maxTokens: 1000,
});

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.additional_kwargs.tool_calls) {
    return 'tools';
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return '__end__';
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

async function workoutPlanner(state: typeof MessagesAnnotation.State) {
  const currentWeekActivities = await getWeeklyActivitiesDB(new Date());
  const currentWeekWorkouts = await getWeeklyWorkoutsDB(new Date());
  const prompt = PromptTemplate.fromTemplate(planningNextWeekTemplate);

  const chain = prompt.pipe(
    model.withStructuredOutput(planningNextWeekSchema, {
      name: 'output_formatter',
    })
  );

  const currentMessageContent = state.messages[state.messages.length - 1].content.toString();

  const response = await chain.invoke({
    input: currentMessageContent,
    currentWeekActivities,
    currentWeekWorkouts,
  });

  return { messages: [response] };
}

// Define a new graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addEdge('__start__', 'agent')
  .addNode('tools', toolNode)
  .addEdge('tools', 'agent')
  .addConditionalEdges('agent', shouldContinue)
  // .addNode('output_formatter', formatOutput)
  // .addEdge('agent', 'output_formatter')
  // .addConditionalEdges('output_formatter', shouldContinue);

export const agent = graph.compile();
