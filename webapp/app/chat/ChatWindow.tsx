'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useRef, useState, ReactElement } from 'react';

import { ChatMessageBubble } from '@/app/chat/ChatMessageBubble';
import { UploadDocumentsForm } from '@/app/chat/UploadDocumentsForm';
import { IntermediateStep } from '@/app/chat/IntermediateStep';
import { useToast } from '@/app/components/Toaster';
import Loading from '@/app/loading';
import { BsPersonVcardFill } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import React from 'react';

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent: ReactElement;
  placeholder?: string;
  titleText?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
}) {
  const endOfMessageRef = useRef<HTMLDivElement | null>(null);
  
  const { toast } = useToast();
  const {
    endpoint,
    emptyStateComponent,
    placeholder,
    titleText = 'An LLM',
    showIngestForm,
    showIntermediateStepsToggle,
  } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(true);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);
  const ingestForm = showIngestForm && (
    <UploadDocumentsForm></UploadDocumentsForm>
  );
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input
        type='checkbox'
        id='show_intermediate_steps'
        name='show_intermediate_steps'
        checked={showIntermediateSteps}
        onChange={(e) => setShowIntermediateSteps(e.target.checked)}
      ></input>
      <label className='text-sm' htmlFor='show_intermediate_steps'>
        {' '}
        Show intermediate steps
      </label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, 'base64').toString('utf8'))
        : [];
      const messageIndexHeader = response.headers.get('x-message-index');
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    streamMode: 'text',
    onError: (e) => {
      toast({ type: 'error', content: 'Failed to send message: ' + e.message });
    },
  });

  const predefinedMessages = [
    'Plan workouts for next week.',
    'A full plan for my next A race.',
    'Adjust workouts for the rest of the week.',
    "Analyze my last week's training activity, summarize as coach.",
  ];

  async function showIntermediateMessage() {
    setIntermediateStepsLoading(true);
    setInput('');
    const messagesWithUserReply = messages.concat({
      id: messages.length.toString(),
      content: input,
      role: 'user',
    });
    setMessages(messagesWithUserReply);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        messages: messagesWithUserReply,
        show_intermediate_steps: true,
      }),
    });
    const json = await response.json();
    setIntermediateStepsLoading(false);
    if (response.status === 200) {
        const responseMessages: Message[] = json.messages;
        // Represent intermediate steps as system messages for display purposes
        // TODO: Add proper support for tool messages
        const toolCallMessages = responseMessages.filter((responseMessage: Message) => {
          return (responseMessage.role === "assistant" && !!responseMessage.tool_calls?.length) || responseMessage.role === "tool";
        });
        const intermediateStepMessages = [];
        for (let i = 0; i < toolCallMessages.length; i += 2) {
          const aiMessage = toolCallMessages[i];
          const toolMessage = toolCallMessages[i + 1];
          intermediateStepMessages.push({
            id: (messagesWithUserReply.length + (i / 2)).toString(),
            role: "system" as const,
            content: JSON.stringify({
              action: aiMessage.tool_calls?.[0],
              observation: toolMessage.content,
            })
          });
        }
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
        setMessages([
          ...newMessages,
          {
            id: (newMessages.length).toString(),
            content: responseMessages[responseMessages.length - 1].content,
            role: "assistant"
          },
        ]);
    } else {
      if (json.error) {
        toast({
          type: 'error',
          content: 'Failed to send message: ' + json.error,
        });
        throw new Error(json.error);
      }
    }
  }

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (endOfMessageRef.current) {
      console.log('scroll into view');
      endOfMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return <Loading />;
    }

    if (showIntermediateSteps) {
      showIntermediateMessage();
    } else {
      handleSubmit(e);
    }
  }

  return (
    <div
      className={`h-full flex flex-col items-center px-4 py-2 rounded grow overflow-y-auto scroll`}
    >
      <h2
        className={`w-full flex justify-center items-center gap-2 p-1 font-ai bg-slate-200 dark:bg-slate-700`}
      >
        <BsPersonVcardFill className='inline-block mr-2 text-yellow-400' />
        {titleText}
      </h2>
      {messages.length === 0 ? emptyStateComponent : ''}
      <div
        className='flex-1 flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out scroll'
      >
        {messages.length > 0 &&
          [...messages].reverse().map((message, i) => {
            return message.role === 'system' ? (
              <IntermediateStep key={message.id} message={message} />
            ) : (
              <ChatMessageBubble
                key={message.id}
                message={message}
                sources={
                  sourcesForMessages[(messages.length - 1 - i).toString()]
                }
              />
            );
          })}
      </div>
      {messages.length === 0 && ingestForm}
      <form onSubmit={sendMessage} className='flex w-full flex-col'>
        <div ref={endOfMessageRef} />
        <div className='flex flex-wrap mb-2 text-xs'>
          {predefinedMessages.map((message, index) => (
            <button
              key={index}
              type='submit'
              className='btn btn-secondary mr-2 mb-2 text-xs tracking-tight font-sans'
              onClick={() => setInput(message)}
            >
              {message}
            </button>
          ))}
        </div>
        <div className='flex'>{intemediateStepsToggle}</div>
        <div className='flex w-full mt-2'>
          <input
            className='grow mr-4 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-sm'
            value={input}
            placeholder={placeholder ?? "So what's your plan for today?"}
            onChange={handleInputChange}
          />
          <button type='submit' className='btn btn-primary px-3 py-1 text-xs'>
            {chatEndpointIsLoading || intermediateStepsLoading ? (
              <div role='status' className='flex justify-center'>
                <span className='sr-only'>Loading...</span>
                <Loading />
              </div>
            ) : (
              <span className='flex items-center'>
                <IoSend className='ml-1' />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
