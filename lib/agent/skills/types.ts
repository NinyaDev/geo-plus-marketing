import type { AgentMessage, AgentResponse } from "../types";

export interface Skill {
  name: string;
  description: string;
  triggers: string[];
  execute(message: AgentMessage): Promise<AgentResponse>;
}
