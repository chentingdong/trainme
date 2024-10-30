import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { db } from '@trainme/db';
import { withAuth } from '@workos-inc/authkit-nextjs';
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
  const { user: authUser } = await withAuth({ ensureSignedIn: true });
  const dbUser = await db.user.findUnique({ where: { id: authUser.id } });
  if (!dbUser) { 
    throw new Error("User not found");
  }
  return dbUser.athleteId; 
}