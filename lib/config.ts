function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string = ""): string {
  return process.env[name] || fallback;
}

export function getConfig() {
  return {
    telegram: {
      botToken: requireEnv("TELEGRAM_BOT_TOKEN"),
      webhookSecret: requireEnv("TELEGRAM_WEBHOOK_SECRET"),
      webhookUrl: optionalEnv("TELEGRAM_WEBHOOK_URL"),
    },
    openai: {
      apiKey: optionalEnv("OPENAI_API_KEY"),
    },
    supabase: {
      url: optionalEnv("SUPABASE_URL"),
      anonKey: optionalEnv("SUPABASE_ANON_KEY"),
      serviceRoleKey: optionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },
    xai: {
      apiKey: optionalEnv("XAI_API_KEY"),
    },
    google: {
      apiKey: optionalEnv("GOOGLE_API_KEY"),
    },
    gptResearcher: {
      url: optionalEnv("GPT_RESEARCHER_URL", "http://localhost:8000"),
      tavilyApiKey: optionalEnv("TAVILY_API_KEY"),
    },
  } as const;
}

export type Config = ReturnType<typeof getConfig>;
