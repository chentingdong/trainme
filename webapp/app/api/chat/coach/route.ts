import { NextRequest, NextResponse } from 'next/server';
import { Message, StreamingTextResponse } from 'ai';
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from '@langchain/core/messages';
import { Message as VercelChatMessage } from 'ai';
import { agent } from './agent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = body.show_intermediate_steps;
    const messages = (body.messages ?? [])
      .filter(
        (message: Message) =>
          message.role === 'user' || message.role === 'assistant'
      )
      .map(convertVercelMessageToLangChainMessage);

    if (returnIntermediateSteps) {
      const result = await agent.invoke({ 
        messages,
        configurable: { thread_id: 'coach' },
      });

      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 }
      );
    } else {
      const eventStream = await agent.stream({ 
        messages,
        version: 'v2',
        configurable: { thread_id: 'coach' },
      });

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === 'on_chat_model_stream') {
              // Intermediate chat model generations will contain tool calls and no content
              if (!!data.chunk.content) {
                controller.enqueue(textEncoder.encode(data.chunk.content));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    }
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export const convertVercelMessageToLangChainMessage = (
  message: VercelChatMessage
) => {
  if (message.role === 'user') {
    return new HumanMessage(message.content);
  } else if (message.role === 'assistant') {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

export const convertLangChainMessageToVercelMessage = (
  message: BaseMessage | AIMessage | ChatMessage | HumanMessage
) => {
  if (message instanceof HumanMessage) {
    return { content: message.content, role: "user" };
  } else if (message instanceof AIMessage) {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: 'assistant' };
  }
};
