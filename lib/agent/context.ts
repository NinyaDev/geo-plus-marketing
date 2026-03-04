import type { ConversationTurn } from "./types";

const MAX_TURNS = 50;
const conversations = new Map<string, ConversationTurn[]>();

export function getHistory(userId: string): ConversationTurn[] {
  return conversations.get(userId) || [];
}

export function addTurn(userId: string, turn: ConversationTurn): void {
  const history = conversations.get(userId) || [];
  history.push(turn);
  if (history.length > MAX_TURNS) {
    history.splice(0, history.length - MAX_TURNS);
  }
  conversations.set(userId, history);
}

export function clearHistory(userId: string): void {
  conversations.delete(userId);
}
