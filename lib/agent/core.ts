import type { AgentMessage, AgentResponse } from "./types";
import { addTurn, getHistory } from "./context";
import { runMarketingAgent } from "./voltagent/agents/marketing";

export async function handleMessage(
  message: AgentMessage
): Promise<AgentResponse> {
  await addTurn(message.userId, {
    role: "user",
    content: message.text,
    timestamp: message.timestamp,
  });

  let response: AgentResponse;

  try {
    const history = await getHistory(message.userId);
    const conversationHistory = history
      .slice(-20)
      .map((turn) => ({
        role: turn.role as "user" | "assistant",
        content: turn.content,
      }));

    const aiResponse = await runMarketingAgent(message.text, {
      userId: message.userId,
      conversationHistory,
    });

    response = { text: aiResponse, skill: "marketing-agent" };
  } catch (error) {
    console.error("Agent error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("API key") || errorMessage.includes("api_key")) {
      response = {
        text: "The AI agent is not configured yet. Please set up your ANTHROPIC_API_KEY environment variable.",
      };
    } else {
      response = {
        text: `I encountered an issue processing your request. Please try again.\n\nError: ${errorMessage}`,
      };
    }
  }

  await addTurn(message.userId, {
    role: "assistant",
    content: response.text,
    timestamp: Date.now(),
    skill: response.skill,
  });

  return response;
}

export function getStatus(): { tools: number; uptime: number } {
  return {
    tools: 16,
    uptime: process.uptime(),
  };
}
