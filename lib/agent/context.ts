import type { ConversationTurn } from "./types";
import { isSupabaseConfigured } from "../supabase/client";

const MAX_TURNS = 50;
const MAX_RETRIES = 2;

// In-memory fallback when Supabase is unavailable
const localConversations = new Map<string, ConversationTurn[]>();

export async function getHistory(userId: string): Promise<ConversationTurn[]> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseAdmin } = await import("../supabase/client");
      const supabase = getSupabaseAdmin();
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
      const { getSupabaseAdmin } = await import("../supabase/client");
      const supabase = getSupabaseAdmin();

      // Retry loop with optimistic locking via updated_at
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const { data: existing } = await supabase
          .from("conversations")
          .select("id, messages, updated_at")
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

        const now = new Date().toISOString();

        if (existing) {
          // Optimistic lock: only update if updated_at hasn't changed since we read
          const { error: updateErr, count } = await supabase
            .from("conversations")
            .update({ messages, updated_at: now })
            .eq("id", existing.id)
            .eq("updated_at", existing.updated_at);

          // If count is 0 and no error, another write happened — retry
          if (!updateErr && count === 0 && attempt < MAX_RETRIES) {
            continue;
          }
          if (updateErr) {
            console.error("[Context] Update failed:", updateErr.message);
          }
        } else {
          const { error: insertErr } = await supabase
            .from("conversations")
            .insert({
              user_id: userId,
              channel: "telegram",
              messages,
            });
          if (insertErr) {
            console.error("[Context] Insert failed:", insertErr.message);
          }
        }

        // Success or exhausted retries — break
        break;
      }
      return;
    } catch (e) {
      console.error("[Context] Supabase error, falling back to in-memory:", e);
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
      const { getSupabaseAdmin } = await import("../supabase/client");
      const supabase = getSupabaseAdmin();
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
