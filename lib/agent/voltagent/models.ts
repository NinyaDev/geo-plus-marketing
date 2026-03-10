import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

// Claude Opus 4.5 — primary content generation & agent brain
export const contentModel = anthropic("claude-opus-4-5-20250219");

// Claude Sonnet — lighter model for simple tasks
export const lightModel = anthropic("claude-sonnet-4-5-20250514");

// Grok — research & scraping intelligence
export const researchModel = xai("grok-3-mini-fast");

// Note: Gemini image gen uses @google/genai directly (not Vercel AI SDK)
// See tools/cta-image.ts for Gemini integration
