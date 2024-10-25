"use client";

import { Message } from 'ai';
import { useChat } from "ai/react";
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";

import { ChatMessageBubble } from "@/app/chat/ChatMessageBubble";
import { UploadDocumentsForm } from "@/app/chat/UploadDocumentsForm";
import { IntermediateStep } from "@/app/chat/IntermediateStep";
import { useToast } from '@/app/components/Toaster';

export function ChatWindow(props: {
  endpoint: string,
  emptyStateComponent: ReactElement,
  placeholder?: string,
  titleText?: string,
  emoji?: string;
  showIngestForm?: boolean,
  showIntermediateStepsToggle?: boolean;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { endpoint, emptyStateComponent, placeholder, titleText = "An LLM", showIngestForm, showIntermediateStepsToggle, emoji } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] = useState(false);
  const ingestForm = showIngestForm && <UploadDocumentsForm></UploadDocumentsForm>;
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input type="checkbox" id="show_intermediate_steps" name="show_intermediate_steps" checked={showIntermediateSteps} onChange={(e) => setShowIntermediateSteps(e.target.checked)}></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onResponse(response) {
        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader ? JSON.parse((Buffer.from(sourcesHeader, 'base64')).toString('utf8')) : [];
        const messageIndexHeader = response.headers.get("x-message-index");
        if (sources.length && messageIndexHeader !== null) {
          setSourcesForMessages({ ...sourcesForMessages, [messageIndexHeader]: sources });
        }
      },
      streamMode: "text",
      onError: (e) => {
        toast({ type: "error", content: "Failed to send message: " + e.message });
      }
    });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
      // Some extra work to show intermediate steps properly
    } else {
      setIntermediateStepsLoading(true);
      setInput("");
      const messagesWithUserReply = messages.concat({ id: messages.length.toString(), content: input, role: "user" });
      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true
        })
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
          toast({ type: "error", content: "Failed to send message: " + json.error });
          throw new Error(json.error);
        }
      }
    }
  }

  return (
    <div className={`h-full flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden ${(messages.length > 0 ? "border" : "")}`}>
      <h2 className={`${messages.length > 0 ? "" : "hidden"} text-2xl`}>{emoji} {titleText}</h2>
      {messages.length === 0 ? emptyStateComponent : ""}
      <div
        className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0 ? (
          [...messages]
            .reverse()
            .map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return (m.role === "system"
                ? <IntermediateStep key={m.id} message={m}></IntermediateStep>
                : <ChatMessageBubble key={m.id} message={m} aiEmoji={emoji} sources={sourcesForMessages[sourceKey]}></ChatMessageBubble>);
            })
        ) : (
          ""
        )}
      </div>

      {messages.length === 0 && ingestForm}

      <form onSubmit={sendMessage} className="flex w-full flex-col">
        <div className="flex">
          {intemediateStepsToggle}
        </div>
        <div className="flex w-full mt-2">
          <input
            className="grow mr-4 px-3 py-2 text-sm rounded"
            value={input}
            placeholder={placeholder ?? "So what's your plan for today?"}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary px-3 py-2 text-sm">
            <div role="status" className={`${(chatEndpointIsLoading || intermediateStepsLoading) ? "" : "hidden"} flex justify-center`}>
              <span className="sr-only">Loading...</span>
            </div>
            <span className={(chatEndpointIsLoading || intermediateStepsLoading) ? "hidden" : ""}>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
