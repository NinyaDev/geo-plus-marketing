import type { ConversationTurn } from "./types";
import { isSupabaseConfigured } from "../supabase/client";

const MAX_TURNS = 50;

// In-memory fallback when Supabase is unavailable
const localConversations = new Map<string, ConversationTurn[]>();

export async function getHistory(userId: string): Promise<ConversationTurn[]> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      const { data } = await supabase
        .from("conversations")
        .select("messages")
        .eq("user_id", userId)
        .eq("channel", "telegram")
        .single();

      if (data?.messages) {
        return data.messages as ConversationTurn[];
      }
    } catch {
      // fall through to in-memory
    }
  }
  return localConversations.get(userId) || [];
}

export async function addTurn(
  userId: string,
  turn: ConversationTurn
): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();

      // Try to fetch existing conversation
      const { data: existing } = await supabase
        .from("conversations")
        .select("id, messages")
        .eq("user_id", userId)
        .eq("channel", "telegram")
        .single();

      let messages: ConversationTurn[] = [];
      if (existing?.messages) {
        messages = existing.messages as ConversationTurn[];
      }
      messages.push(turn);

      // Trim to MAX_TURNS
      if (messages.length > MAX_TURNS) {
        messages = messages.slice(messages.length - MAX_TURNS);
      }

      if (existing) {
        await supabase
          .from("conversations")
          .update({ messages, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("conversations").insert({
          user_id: userId,
          channel: "telegram",
          messages,
        });
      }
      return;
    } catch {
      // fall through to in-memory
    }
  }

  // In-memory fallback
  const history = localConversations.get(userId) || [];
  history.push(turn);
  if (history.length > MAX_TURNS) {
    history.splice(0, history.length - MAX_TURNS);
  }
  localConversations.set(userId, history);
}

export async function clearHistory(userId: string): Promise<void> {
  localConversations.delete(userId);

  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      await supabase
        .from("conversations")
        .delete()
        .eq("user_id", userId)
        .eq("channel", "telegram");
    } catch {
      // ignore
    }
  }
}
