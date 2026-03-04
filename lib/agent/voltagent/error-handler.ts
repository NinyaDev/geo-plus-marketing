const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export class AgentError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly retryable: boolean = false,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "AgentError";
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  provider: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const message = lastError.message.toLowerCase();

      // Check if retryable
      const isRateLimit =
        message.includes("rate limit") ||
        message.includes("429") ||
        message.includes("too many requests");
      const isTimeout =
        message.includes("timeout") || message.includes("timed out");
      const isServerError =
        message.includes("500") ||
        message.includes("502") ||
        message.includes("503");

      if (!isRateLimit && !isTimeout && !isServerError) {
        // Not retryable
        throw new AgentError(lastError.message, provider, false);
      }

      if (attempt < maxRetries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new AgentError(
    `${provider} failed after ${maxRetries + 1} attempts: ${lastError?.message}`,
    provider,
    false
  );
}

export function formatUserError(error: unknown): string {
  if (error instanceof AgentError) {
    if (error.message.includes("API key")) {
      return `The ${error.provider} API key is not configured. Please check your environment variables.`;
    }
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      return `The ${error.provider} service is temporarily rate-limited. Please try again in a moment.`;
    }
    return `An error occurred with ${error.provider}. Please try again.`;
  }

  if (error instanceof Error) {
    if (error.message.includes("fetch")) {
      return "A network error occurred. Please try again.";
    }
    return `An unexpected error occurred: ${error.message}`;
  }

  return "An unexpected error occurred. Please try again.";
}
