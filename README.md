# GEOPlusMarketing

An AI-powered Sales Hub that helps franchisees sell AI Search Visibility (GEO) services to local businesses. The website educates prospects and captures leads through geo-targeted landing pages and a contact form, syncs them to GoHighLevel CRM, and provides a Telegram-based AI agent for lead management, content generation, and prospecting. The admin dashboard gives a read-only overview of leads, prospects, and content.

## Core Flow

```
Website (educates prospects)
  → Contact form captures leads → Supabase + GoHighLevel CRM
  → Franchisee manages leads & generates content via Telegram bot
  → Dashboard provides read-only overview
```

## Features

| Feature | Description |
| :--- | :--- |
| **Lead Capture Pipeline** | Contact form with Zod validation, saves to Supabase, auto-syncs to GoHighLevel CRM with tags and notes. Core feature. |
| **Telegram AI Agent** | Bot powered by Claude Haiku 4.5 with 16 specialized tools. Lead management is priority #1, content generation #2. |
| **Admin Dashboard** | Live-updating stat cards (leads, prospects, published content), clickable status badges, GHL bulk sync button, content management with publish/delete. Password-protected. |
| **Dynamic Landing Pages** | Auto-generated geo-targeted pages for any city/service combo via URL (`/landing/miami/plumbing`) with OG images. |
| **Blog System** | Markdown-rendered blog with react-markdown, type filtering, SEO metadata, and static generation. |
| **Lead Prospecting** | AI-powered local market research (via Grok/xAI) that finds real businesses with websites and phone numbers, scored on quality. |
| **Content Generation** | Blog posts, social media posts (GBP, Instagram, Facebook), review responses, landing pages, and schema markup. Saved to Supabase as drafts. |
| **CTA Image Generation** | AI-generated advertising visuals via Google Gemini. |
| **GHL CRM Integration** | Auto-sync leads on capture and on bot add. Bulk sync from dashboard. Contact creation with tagging and notes. |
| **Multi-LLM Architecture** | Claude Haiku 4.5 (agent brain + content), Grok/xAI (research/prospecting), Google Gemini (image generation). |
| **Demo Data Fallback** | Full functionality without API keys using realistic mock data. |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| AI Engine | Vercel AI SDK v6, Claude Haiku 4.5, Grok/xAI, Google Gemini |
| Database | Supabase (PostgreSQL) — 6 tables |
| CRM | GoHighLevel (PIT integration) |
| Bot | Telegraf (Telegram Bot API) |
| Deployment | Vercel |

## Project Structure

```
app/
  (marketing)/              # Public pages
    page.tsx                 # Homepage
    contact/page.tsx         # Lead capture form
    blog/page.tsx            # Blog index
    blog/[slug]/page.tsx     # Blog post detail (react-markdown)
    landing/[city]/[service]/page.tsx  # Dynamic landing pages
  (dashboard)/
    layout.tsx               # Dashboard layout (topbar, no sidebar)
    dashboard/page.tsx       # Admin dashboard (server component → DashboardClient)
    login/page.tsx           # Password gate
  api/
    leads/route.ts           # POST — lead capture + GHL sync
                             # PATCH — status change (lead/prospect/contacted) + auto GHL sync
                             # PUT — bulk GHL sync
    content/route.ts         # GET — published content
                             # PATCH — publish/unpublish
                             # DELETE — remove content
    dashboard/route.ts       # GET — dashboard data
    telegram/route.ts        # POST — Telegram webhook (dedup, always-200)
    auth/login/route.ts      # POST — dashboard auth

components/
  ui/                        # StatCard (accent colors), Badge, Button, Input
  layout/                    # PublicNav, Footer, DashboardTopbar
  contact/                   # LeadForm (client component)
  landing/                   # LandingTemplate
  blog/                      # ContentCard (stripMarkdown), ContentFilter
  dashboard/                 # DashboardClient, LeadsTable, ProspectsTable,
                             # StatusBadge, ContentList

lib/
  agent/
    core.ts                  # Message router (skills + AI agent)
    voltagent/
      agents/marketing.ts    # System prompt + generateText loop
      models.ts              # LLM provider config (Haiku, Grok, Gemini)
      tools/                 # 16 AI tools (index.ts exports allTools)
        helpers.ts           # getOrCreateBusinessId (auto-creates businesses)
        lead.ts              # add_lead (+ GHL sync)
        get-leads.ts         # get_leads (all leads including contact form)
        prospect.ts          # prospect_businesses (Grok research)
        content.ts           # generate_geo_content (blog/landing)
        social-post.ts       # create_social_post (GBP/IG/FB)
        publish-content.ts   # list + publish content
        ...                  # + 9 more tools
      guards.ts              # Rate limiting + token tracking
  bot/
    handlers.ts              # Telegram command + message handlers
    instance.ts              # Telegraf bot setup
  data/                      # Data layer with Supabase fallback to demo data
    content.ts               # normalizeContent (metadata → excerpt/author/tags)
    leads.ts                 # Lead queries with legacy status support
    dashboard.ts             # Live stats from Supabase
  ghl/client.ts              # GoHighLevel API client
  supabase/client.ts         # Supabase singleton
  config.ts                  # Env config
```

## Supabase Schema (6 tables)

| Table | Purpose |
| :--- | :--- |
| `businesses` | Franchisee business profiles (linked by `telegram_user_id`) |
| `leads` | Leads + prospects (status: lead/prospect/contacted) |
| `content` | Generated content (blog/social/landing). `excerpt`, `author`, `tags` stored in `metadata` JSONB. |
| `campaigns` | Marketing campaign plans |
| `analytics` | Business metrics |
| `conversations` | Persistent chat history per user |

## How to Run Locally

### Prerequisites

- Node.js 18+
- A Supabase project (optional — demo data works without it)

### Setup

```bash
git clone https://github.com/NinyaDev/geo-plus-marketing.git
cd geo-plus-marketing
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Required for full functionality:

```env
ANTHROPIC_API_KEY=         # Claude Haiku 4.5 — agent brain + content
SUPABASE_URL=              # Supabase project URL
SUPABASE_ANON_KEY=         # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY= # Supabase service role key
TELEGRAM_BOT_TOKEN=        # Telegram bot token from @BotFather
TELEGRAM_WEBHOOK_SECRET=   # openssl rand -hex 32
TELEGRAM_WEBHOOK_URL=      # Your public URL + /api/telegram
XAI_API_KEY=               # Grok — research/prospecting
GOOGLE_API_KEY=            # Gemini — image generation
GHL_PIT=                   # GoHighLevel Private Integration Token
GHL_LOCATION_ID=           # GoHighLevel Location ID
```

Run the database migrations (in Supabase SQL Editor):

```sql
-- Paste contents of supabase/migrations/001_domain_tables.sql
-- Paste contents of supabase/migrations/002_add_content_slug.sql
```

Start the dev server:

```bash
npm run dev
```

### Pages to Test

- `http://localhost:3000` — Homepage
- `http://localhost:3000/contact` — Lead form
- `http://localhost:3000/blog` — Blog
- `http://localhost:3000/dashboard` — Dashboard (password protected)
- `http://localhost:3000/landing/miami/plumbing` — Dynamic landing page (any city/service works)

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/leads` | Capture lead, validate, save to Supabase, sync to GHL |
| PATCH | `/api/leads` | Change lead status (lead/prospect/contacted), auto-sync to GHL |
| PUT | `/api/leads` | Bulk sync all leads to GHL |
| GET | `/api/content` | Published content, filterable by `?type=` |
| PATCH | `/api/content` | Publish/unpublish content |
| DELETE | `/api/content` | Delete content by ID |
| GET | `/api/dashboard` | Aggregated stats, leads, content |
| POST | `/api/telegram` | Telegram bot webhook |
| POST | `/api/auth/login` | Dashboard authentication |

## Agent Tools (16)

| Tool | Purpose |
| :--- | :--- |
| `add_lead` | Track leads manually + auto-sync to GHL |
| `get_leads` | Query all leads/prospects (includes contact form leads) |
| `prospect_businesses` | AI market prospecting with quality scoring (Grok) |
| `generate_lead_report` | Lead metrics by period |
| `generate_geo_content` | AI blog posts and landing page copy |
| `create_social_post` | Platform-specific posts (GBP, Instagram, Facebook) |
| `list_and_publish_content` | List drafts, publish to blog |
| `draft_review_response` | Professional review replies with SEO keywords |
| `register_business` | Save client business profiles |
| `get_business` | Retrieve business info |
| `create_campaign` | Full marketing campaign plans |
| `generate_landing_page` | Complete HTML landing pages |
| `generate_schema` | JSON-LD structured data |
| `generate_cta_image` | AI advertising visuals (Gemini) |
| `deep_research` | Comprehensive market/competitor research (Grok) |
| `generate_status_report` | Business performance summary |

## License

Built as part of a project for Utlyze / Solution Stream.

## Contact

**Adrian Ninanya**
- GitHub: [NinyaDev](https://github.com/NinyaDev)
- Project Link: [https://github.com/NinyaDev/geo-plus-marketing](https://github.com/NinyaDev/geo-plus-marketing)
