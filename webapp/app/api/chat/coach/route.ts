import { NextRequest, NextResponse } from 'next/server';
import { Message } from 'ai';

import { agent } from './agent';
import {
  convertLangChainMessageToVercelMessage,
  convertVercelMessageToLangChainMessage,
} from '@/app/api/chat/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = body.show_intermediate_steps;
    const messages = (body.messages ?? [])
    .filter((message: Message) =>
        message.role === 'user' || message.role === 'assistant'
    )
    .map(convertVercelMessageToLangChainMessage);

  if (!returnIntermediateSteps) {
    const result = await agent.invoke({
      messages,
      configurable: { thread_id: '42' },
    });

    const textEncoder = new TextEncoder();
    const transformStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          textEncoder.encode(
            result.messages[result.messages.length - 1].content
          )
        );
        controller.close();
      },
    });

    return new Response(transformStream);
  } else {
    const result = await agent.invoke({
      messages,
      configurable: { thread_id: '42' },
    });
    return NextResponse.json(
      {
        messages: result.messages.map(convertLangChainMessageToVercelMessage),
      },
      { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}