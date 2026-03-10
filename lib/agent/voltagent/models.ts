import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

// Claude Sonnet 4.6 — primary content generation & agent brain
export const contentModel = anthropic("claude-sonnet-4-6");

// Claude Haiku 4.5 — lighter model for simple tasks
export const lightModel = anthropic("claude-haiku-4-5-20251001");

// Grok — research & scraping intelligence
export const researchModel = xai("grok-3-mini-fast");

// Note: Gemini image gen uses @google/genai directly (not Vercel AI SDK)
// See tools/cta-image.ts for Gemini integration
