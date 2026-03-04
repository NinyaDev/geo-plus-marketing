const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_MESSAGES_PER_HOUR = 50;
const HOUR_MS = 3600000;

export function checkRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetIn?: number;
} {
  const now = Date.now();
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
