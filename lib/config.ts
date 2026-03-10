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
      botToken: optionalEnv("TELEGRAM_BOT_TOKEN"),
      webhookSecret: optionalEnv("TELEGRAM_WEBHOOK_SECRET"),
      webhookUrl: optionalEnv("TELEGRAM_WEBHOOK_URL"),
    },
    anthropic: {
      apiKey: optionalEnv("ANTHROPIC_API_KEY"),
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
    ghl: {
      pit: optionalEnv("GHL_PIT"),
      locationId: optionalEnv("GHL_LOCATION_ID"),
      apiBase: optionalEnv(
        "GHL_API_BASE",
        "https://services.leadconnectorhq.com"
      ),
    },
    gptResearcher: {
      url: optionalEnv("GPT_RESEARCHER_URL", "http://localhost:8000"),
      tavilyApiKey: optionalEnv("TAVILY_API_KEY"),
    },
  } as const;
}

export type Config = ReturnType<typeof getConfig>;
