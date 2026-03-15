import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

// Claude Haiku 4.5 — agent brain for tool routing (fast, high rate limits)
export const agentModel = anthropic("claude-haiku-4-5-20251001");

// Claude Sonnet 4.6 — high-quality content generation inside tools
export const contentModel = anthropic("claude-sonnet-4-6");

// Grok — research & scraping intelligence
export const researchModel = xai("grok-3-mini-fast");

// Note: Gemini image gen uses @google/genai directly (not Vercel AI SDK)
// See tools/cta-image.ts for Gemini integration
