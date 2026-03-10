# GEOPlusMarketing

An AI-powered marketing and sales hub that helps franchisees sell AI Search Visibility (GEO) services to local businesses. The website captures leads through geo-targeted landing pages and a contact form, syncs them to GoHighLevel CRM, and provides a Telegram-based AI agent for content generation, lead prospecting, and campaign management.

## Features

| Feature | Description |
| :--- | :--- |
| **Dynamic Landing Pages** | Auto-generated geo-targeted pages for any city/service combo via URL (`/landing/miami/plumbing`). |
| **Lead Capture Pipeline** | Contact form with Zod validation, saves to Supabase, auto-syncs to GoHighLevel CRM with tags and notes. |
| **AI Marketing Agent** | Telegram bot powered by Claude Sonnet 4.6 with 14 specialized tools for content, leads, and campaigns. |
| **Blog System** | Markdown-rendered blog with type filtering, SEO metadata, and static generation. |
| **Admin Dashboard** | Stats overview, leads table, campaign status, and content management. |
| **Multi-LLM Architecture** | Claude Sonnet 4.6 (content), Grok/xAI (research/prospecting), Google Gemini (image generation). |
| **Lead Prospecting** | AI-powered local market research that scores businesses on website, GBP, and SEO quality. |
| **Content Generation** | Blog posts, social media posts, review responses, landing pages, and schema markup. |
| **CTA Image Generation** | AI-generated advertising visuals via Google Gemini. |
| **Campaign Orchestration** | Full marketing plans with content calendars, channel strategy, and KPIs. |
| **Schema Markup** | JSON-LD structured data generation for LocalBusiness, Dentist, Plumber, Attorney, etc. |
| **GHL CRM Integration** | Auto-sync leads with contact creation, tagging, and note attachment. |
| **Demo Data Fallback** | Full functionality without API keys using realistic mock data. |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| AI Engine | Vercel AI SDK v6, Claude Sonnet 4.6, Grok/xAI, Google Gemini |
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
    blog/[slug]/page.tsx     # Blog post detail
    landing/[city]/[service]/page.tsx  # Dynamic landing pages
  (dashboard)/
    dashboard/page.tsx       # Admin dashboard
  api/
    leads/route.ts           # POST — lead capture + GHL sync
    content/route.ts         # GET — published content
    dashboard/route.ts       # GET — dashboard data
    telegram/route.ts        # POST — Telegram webhook

components/
  ui/                        # Card, Badge, Button, Input, StatCard
  layout/                    # PublicNav, Footer, DashboardSidebar, DashboardTopbar
  contact/                   # LeadForm (client component)
  landing/                   # LandingTemplate
  blog/                      # ContentCard, ContentFilter
  dashboard/                 # LeadsTable, CampaignStatus, ContentList

lib/
  agent/
    core.ts                  # Message router (skills + AI agent)
    voltagent/
      agents/marketing.ts    # System prompt + generateText loop
      models.ts              # LLM provider config
      tools/                 # 14 AI tools (index.ts exports allTools)
      guards.ts              # Rate limiting + token tracking
  bot/
    handlers.ts              # Telegram command + message handlers
    instance.ts              # Telegraf bot setup
  data/                      # Data layer with Supabase fallback to demo data
  ghl/client.ts              # GoHighLevel API client
  supabase/client.ts         # Supabase singleton
  utils/                     # cn, format
```

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
ANTHROPIC_API_KEY=         # Claude Sonnet 4.6 — agent brain
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

Run the database migration (in Supabase SQL Editor):

```sql
-- Paste contents of supabase/migrations/001_domain_tables.sql
```

Start the dev server:

```bash
npm run dev
```

### Pages to Test

- `http://localhost:3000` — Homepage
- `http://localhost:3000/contact` — Lead form
- `http://localhost:3000/blog` — Blog
- `http://localhost:3000/dashboard` — Dashboard
- `http://localhost:3000/landing/miami/plumbing` — Dynamic landing page (any city/service works)

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/leads` | Capture lead, validate, save to Supabase, sync to GHL |
| GET | `/api/content` | Published content, filterable by `?type=` |
| GET | `/api/dashboard` | Aggregated stats, leads, content, campaigns |
| POST | `/api/telegram` | Telegram bot webhook |

## Agent Tools (14)

| Tool | Purpose |
| :--- | :--- |
| `register_business` | Save client business profiles |
| `get_business` | Retrieve business info |
| `generate_geo_content` | AI blog posts and landing page copy |
| `create_social_post` | Platform-specific posts (GBP, Instagram, Facebook) |
| `draft_review_response` | Professional review replies with SEO keywords |
| `add_lead` | Manually track leads |
| `prospect_businesses` | AI market prospecting with quality scoring |
| `generate_lead_report` | Lead metrics by period |
| `create_campaign` | Full marketing campaign plans |
| `generate_landing_page` | Complete HTML landing pages |
| `generate_schema` | JSON-LD structured data |
| `generate_cta_image` | AI advertising visuals (Gemini) |
| `deep_research` | Comprehensive market/competitor research |
| `generate_status_report` | Business performance summary |

## License

Built as part of a project for Utlyze / Solution Stream.

## Contact

**Adrian Ninanya**
- GitHub: [NinyaDev](https://github.com/NinyaDev)
- Project Link: [https://github.com/NinyaDev/geo-plus-marketing](https://github.com/NinyaDev/geo-plus-marketing)
