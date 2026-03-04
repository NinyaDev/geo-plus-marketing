import type { Skill } from "./types";
import type { AgentMessage, AgentResponse } from "../types";
import { echoSkill } from "./echo";

const skills: Skill[] = [echoSkill];

export function getSkills(): Skill[] {
  return skills;
}

export function matchSkill(message: AgentMessage): Skill | null {
  const text = message.text.toLowerCase().trim();
  for (const skill of skills) {
    for (const trigger of skill.triggers) {
      if (text.startsWith(trigger)) {
        return skill;
      }
    }
  }
  return null;
}

export async function dispatchSkill(
  skill: Skill,
  message: AgentMessage
): Promise<AgentResponse> {
  return skill.execute(message);
}
