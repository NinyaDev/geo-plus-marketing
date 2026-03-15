import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

// Claude Haiku 4.5 — all Anthropic usage on Haiku for maximum rate limits + lowest cost
// Agent brain (tool routing) and content generation both use this model
export const agentModel = anthropic("claude-haiku-4-5-20251001");
export const contentModel = agentModel;

// Grok — research & scraping intelligence
export const researchModel = xai("grok-3-mini-fast");

// Note: Gemini image gen uses @google/genai directly (not Vercel AI SDK)
// See tools/cta-image.ts for Gemini integration
