import { auth } from '@clerk/nextjs/server';
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { db } from '@trainme/db';
import { Message as VercelChatMessage } from "ai";

export const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

export const convertLangChainMessageToVercelMessage = (message: BaseMessage | AIMessage) => {
  if (message._getType() === "human") {
    return { 
      role: "user",
      content: message.content, 
    };
  } else if (message._getType() === "ai") {
    return {
      role: "assistant",
      content: message.content,
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { 
      role: message._getType(),
      content: message.content, 
    };
  }
};

export const getAthleteId = async () => {
  const { userId } = await auth();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) { 
    throw new Error("User not found");
  }
  return user.athleteId; 
}