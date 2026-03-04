import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";

// GPT-4o — primary content generation LLM
export const contentModel = openai("gpt-4o");

// GPT-4o-mini — cheaper model for simple tasks
export const lightModel = openai("gpt-4o-mini");

// Grok 4.1 — research & scraping intelligence
export const researchModel = xai("grok-3-mini-fast");

// Note: Gemini image gen uses @google/genai directly (not Vercel AI SDK)
// See tools/cta-image.ts for Gemini integration
