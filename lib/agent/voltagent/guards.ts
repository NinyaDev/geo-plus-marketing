import { isSupabaseConfigured } from "@/lib/supabase/client";

const MAX_MESSAGES_PER_HOUR = 50;
const HOUR_MS = 3600000;

// In-memory rate limits (fast path, works within same container)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetIn?: number;
}> {
  const now = Date.now();

  // Try Supabase-backed rate limiting for cross-container accuracy
  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase/client");
      const supabase = getSupabaseAdmin();

      // Count recent messages from this user's conversation history
      const { data } = await supabase
        .from("conversations")
        .select("messages")
        .eq("user_id", userId)
        .eq("channel", "telegram")
        .single();

      if (data?.messages) {
        const messages = data.messages as Array<{ timestamp?: number }>;
        const oneHourAgo = now - HOUR_MS;
        const recentCount = messages.filter(
          (m) => m.timestamp && m.timestamp > oneHourAgo
        ).length;

        if (recentCount >= MAX_MESSAGES_PER_HOUR) {
          return {
            allowed: false,
            remaining: 0,
            resetIn: 60, // approximate
          };
        }

        return {
          allowed: true,
          remaining: MAX_MESSAGES_PER_HOUR - recentCount,
        };
      }

      // No conversation record yet — allow
      return { allowed: true, remaining: MAX_MESSAGES_PER_HOUR };
    } catch {
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const entry = rateLimits.get(userId);

  if (!entry || now >= entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + HOUR_MS });
    return { allowed: true, remaining: MAX_MESSAGES_PER_HOUR - 1 };
  }

  if (entry.count >= MAX_MESSAGES_PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_MESSAGES_PER_HOUR - entry.count };
}

// Token usage tracking
const tokenUsage = new Map<
  string,
  { input: number; output: number; date: string }
>();

export function trackTokenUsage(
  userId: string,
  input: number,
  output: number
): void {
  const today = new Date().toISOString().split("T")[0];
  const existing = tokenUsage.get(userId);

  if (existing && existing.date === today) {
    existing.input += input;
    existing.output += output;
  } else {
    tokenUsage.set(userId, { input, output, date: today });
  }
}

export function getTokenUsage(
  userId: string
): { input: number; output: number; date: string } | null {
  return tokenUsage.get(userId) || null;
}
