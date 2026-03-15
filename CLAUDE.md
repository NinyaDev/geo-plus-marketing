# Project Context

GEOPlusMarketing — AI-powered marketing and sales hub for franchisees reselling AI Search Visibility (GEO) services to local businesses. Deployed on Vercel under Utlyze org (utlyze-2f74afdb). Project lead: James Brady.

## Rules
- Never add "Co-Authored-By" Claude/Anthropic lines to git commits
- Never mention "NewRewards" on the website — we sell our own branded service
- Git email: adrianninanya@gmail.com

## Architecture
- Next.js 16 App Router, route groups: (marketing) public, (dashboard) admin
- Vercel AI SDK v6 — Claude Sonnet 4.6 (`claude-sonnet-4-6`) as agent brain
- Grok/xAI for research, Google Gemini for images
- Supabase PostgreSQL (6 tables), GoHighLevel CRM, Telegraf Telegram bot
- 14 AI tools in `lib/agent/voltagent/tools/`

## AI SDK v6 Gotchas
- `tool()` uses `inputSchema` not `parameters`
- `generateText()` uses `stopWhen: stepCountIs(N)` not `maxSteps`
- `maxOutputTokens` not `maxTokens`
- Token usage: `usage.inputTokens` / `usage.outputTokens` (NOT promptTokens/completionTokens)
- `stepCountIs` imported from `ai`

## Key Files
- `lib/agent/voltagent/agents/marketing.ts` — agent system prompt + generateText loop
- `lib/agent/voltagent/models.ts` — LLM config (anthropic, xai)
- `lib/agent/voltagent/tools/index.ts` — all 14 tool exports
- `lib/agent/context.ts` — persistent conversation memory (Supabase + fallback)
- `lib/ghl/client.ts` — GoHighLevel CRM integration
- `lib/config.ts` — env config
- `app/api/leads/route.ts` — lead capture (form fields mapped: service_type→service_requested, message→notes, business_name→metadata)

## Two User Types
- **Customers** (local businesses) → website: landing pages, blog, contact form
- **Franchisees** (operators) → Telegram bot: content generation, lead prospecting, campaigns
