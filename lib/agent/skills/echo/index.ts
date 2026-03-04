import type { Skill } from "../types";
import type { AgentMessage, AgentResponse } from "../../types";

export const echoSkill: Skill = {
  name: "echo",
  description: "Echoes back user input (development/testing skill)",
  triggers: ["echo"],

  async execute(message: AgentMessage): Promise<AgentResponse> {
    const text = message.text.replace(/^echo\s+/i, "");
    return {
      text: `Echo: ${text}`,
      skill: "echo",
    };
  },
};
