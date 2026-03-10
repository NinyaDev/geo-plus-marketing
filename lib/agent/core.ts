import type { AgentMessage, AgentResponse } from "./types";
import { addTurn, getHistory } from "./context";
import { matchSkill, dispatchSkill, getSkills } from "./skills/registry";
import { runMarketingAgent } from "./voltagent/agents/marketing";

export async function handleMessage(
  message: AgentMessage
): Promise<AgentResponse> {
  addTurn(message.userId, {
    role: "user",
    content: message.text,
    timestamp: message.timestamp,
  });

  // Prefix match → legacy skills (echo, etc.)
  const skill = matchSkill(message);
  let response: AgentResponse;

  if (skill) {
    response = await dispatchSkill(skill, message);
  } else {
    // No match → VoltAgent marketing agent (Claude Sonnet 4.6)
    try {
      const history = getHistory(message.userId);
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
      console.error("VoltAgent error:", error);
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
  }

  addTurn(message.userId, {
    role: "assistant",
    content: response.text,
    timestamp: Date.now(),
    skill: response.skill,
  });

  return response;
}

export function getStatus(): { skills: string[]; uptime: number } {
  return {
    skills: [
      ...getSkills().map((s) => s.name),
      "marketing-agent (VoltAgent + Claude Sonnet 4.6)",
    ],
    uptime: process.uptime(),
  };
}
