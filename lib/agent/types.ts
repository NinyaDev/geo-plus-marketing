export interface AgentMessage {
  text: string;
  userId: string;
  channel: "telegram" | "whatsapp" | "slack" | "web";
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface AgentResponse {
  text: string;
  skill?: string;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  skill?: string;
}
