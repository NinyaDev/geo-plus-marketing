export interface Business {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  description: string;
  created_at: string;
}

export interface Lead {
  id: string;
  business_id: string | null;
  source: string;
  name: string;
  email: string;
  phone: string;
  service_requested: string;
  city: string;
  website_url?: string;
  gbp_url?: string;
  quality_score?: number;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  notes: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ContentPiece {
  id: string;
  business_id: string;
  title: string;
  slug: string;
  type: "blog" | "social" | "landing" | "email";
  status: "draft" | "published" | "scheduled";
  body: string;
  excerpt: string;
  author: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  name: string;
  type: "seo" | "social" | "email" | "ppc";
  status: "active" | "paused" | "completed" | "draft";
  budget: number;
  spent: number;
  leads_generated: number;
  impressions: number;
  clicks: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_leads: number;
  leads_this_month: number;
  total_content: number;
  published_content: number;
  active_campaigns: number;
  total_revenue: number;
  conversion_rate: number;
  avg_lead_value: number;
}

// --- Demo Business ---

export const demoBusiness: Business = {
  id: "biz_001",
  name: "GEOPlusMarketing",
  slug: "geoplusmarketing",
  city: "Miami",
  state: "FL",
  phone: "3055551234",
  email: "info@geoplusmarketing.com",
  website: "https://geoplusmarketing.com",
  services: [
    "AI Visibility Scans",
    "Schema & Structured Data",
    "Content Optimization",
    "Ongoing AI Monitoring",
    "Full GEO Package",
  ],
  description:
    "AI Search Visibility partner helping local businesses get found, recommended, and cited by every major AI engine.",
  created_at: "2025-01-15T10:00:00Z",
};

// --- Demo Leads ---

export const demoLeads: Lead[] = [
  {
    id: "lead_001",
    business_id: null,
    name: "Maria Rodriguez",
    email: "maria.r@miamidental.com",
    phone: "3055559876",
    service_requested: "Full GEO Package",
    city: "Miami",
    status: "converted",
    notes: "Our competitors are showing up in ChatGPT results but we're not. Need help ASAP.",
    metadata: { business_name: "Miami Dental Group" },
    source: "landing_page",
    created_at: "2026-02-28T14:30:00Z",
  },
  {
    id: "lead_002",
    business_id: null,
    name: "James Thompson",
    email: "j.thompson@thompsonlaw.com",
    phone: "3055554321",
    service_requested: "AI Visibility Scan",
    city: "Coral Gables",
    status: "qualified",
    notes: "We want to understand how AI search engines see our firm. Interested in the free scan.",
    metadata: { business_name: "Thompson Legal Partners" },
    source: "blog",
    created_at: "2026-03-01T09:15:00Z",
  },
  {
    id: "lead_003",
    business_id: null,
    name: "Ana Gutierrez",
    email: "ana@sunshineHVAC.com",
    phone: "3055558765",
    service_requested: "Content Optimization",
    city: "Miami Beach",
    status: "contacted",
    notes: "We have great Google rankings but AI search never mentions us. What can we do?",
    metadata: { business_name: "Sunshine HVAC" },
    source: "google",
    created_at: "2026-03-02T11:45:00Z",
  },
  {
    id: "lead_004",
    business_id: null,
    name: "Robert Chen",
    email: "r.chen@chenrealty.com",
    phone: "3055553456",
    service_requested: "Schema & Structured Data",
    city: "Doral",
    status: "new",
    notes: "Need structured data and schema markup for our 12 listings pages. Want AI to cite us.",
    metadata: { business_name: "Chen Realty Group" },
    source: "contact_form",
    created_at: "2026-03-03T16:20:00Z",
  },
  {
    id: "lead_005",
    business_id: null,
    name: "Sarah Miller",
    email: "sarah@millerplumbing.com",
    phone: "3055557654",
    service_requested: "AI Visibility Scan",
    city: "Kendall",
    status: "new",
    notes: "Heard about AI search optimization on a podcast. Want to see where we stand.",
    metadata: { business_name: "Miller Plumbing Co" },
    source: "social_media",
    created_at: "2026-03-04T08:00:00Z",
  },
];

// --- Demo Content ---

export const demoContent: ContentPiece[] = [
  {
    id: "content_001",
    business_id: "biz_001",
    title: "Why AI Search Is the Biggest Threat to Your Business Right Now",
    slug: "why-ai-search-is-biggest-threat-to-your-business",
    type: "blog",
    status: "published",
    body: `# Why AI Search Is the Biggest Threat to Your Business Right Now

If you're a business owner who has invested in SEO for years, this is going to be uncomfortable to read. The rules are changing — fast.

## The Numbers Don't Lie

According to Bain & Company's February 2025 research, **80% of search users now rely on AI-generated summaries** for more than 40% of their searches. That means your customers are getting answers without ever clicking on your website.

It gets worse:

- **61% drop** in organic click-through rates on queries where AI Overviews appear (Seer Interactive)
- **58.5% of Google searches** are now zero-click (SparkToro/Datos)
- **$750 billion** in US revenue is at risk from AI search disruption by 2028 (McKinsey)

## What This Means for Local Businesses

When someone asks ChatGPT "Who's the best dentist in Miami?", the AI doesn't look at your Google rankings. It looks at:

- **Structured data** on your website (JSON-LD, schema markup)
- **Consistent citations** across the web
- **Authority signals** from trusted sources
- **Content quality** that demonstrates genuine expertise

If you don't have these signals, the AI will recommend your competitor instead. Simple as that.

## SEO Isn't Dead — But It's Not Enough

Traditional SEO still matters. Google Search isn't going away tomorrow. But if you're **only** doing SEO, you're fighting with one hand tied behind your back.

**Generative Engine Optimization (GEO)** is the new layer you need. It works alongside your existing SEO to ensure AI engines can find, understand, and recommend your business.

## What You Can Do Today

1. **Get scanned** — Find out how AI engines currently see your brand
2. **Fix your structured data** — Add JSON-LD schema, llms.txt, and agent.json to your website
3. **Build authority signals** — Get cited in sources that AI engines trust
4. **Monitor continuously** — AI visibility changes weekly; you need to track it

---

**Don't wait until your competitors have already locked in their AI visibility advantage.** [Get your free scan today](/contact) and see exactly where you stand.`,
    excerpt:
      "80% of search users now rely on AI summaries. If ChatGPT can't find your business, your competitors are stealing your customers.",
    author: "GEOPlusMarketing Team",
    tags: ["ai-search", "geo", "business-growth"],
    published_at: "2026-02-15T10:00:00Z",
    created_at: "2026-02-14T08:00:00Z",
  },
  {
    id: "content_002",
    business_id: "biz_001",
    title: "What Is GEO? A Business Owner's Guide to Generative Engine Optimization",
    slug: "what-is-geo-generative-engine-optimization-guide",
    type: "blog",
    status: "published",
    body: `# What Is GEO? A Business Owner's Guide to Generative Engine Optimization

You've heard of SEO. But have you heard of **GEO**?

GEO — Generative Engine Optimization — is the practice of optimizing your brand's digital presence so that AI-powered search engines (ChatGPT, Google Gemini, Perplexity, Grok, Claude) can find, understand, and **recommend** your business.

## How GEO Is Different from SEO

| | SEO | GEO |
|---|---|---|
| **Goal** | Rank on Google Search results page | Get cited and recommended by AI engines |
| **Target** | Google's ranking algorithm | LLMs (Large Language Models) |
| **Signals** | Keywords, backlinks, page speed | Structured data, entity clarity, authority |
| **Output** | Blue link on page 1 | AI mentions your business by name |
| **Timeline** | 3-6 months for results | Can see changes within weeks |

## Why GEO Matters Now

AI search isn't coming — it's here. When someone asks Perplexity "Who's the best HVAC company in Fort Lauderdale?", the AI synthesizes information from across the web and delivers a direct answer. No clicking through 10 blue links.

If your business has:
- Strong structured data (JSON-LD schema markup)
- Consistent NAP citations across directories
- An llms.txt file telling AI how to reference you
- Authority mentions in trusted sources

...then AI will cite you by name. If you don't have these signals, you're invisible.

## The GEO Framework

### 1. Scan — See What AI Sees
We query multiple AI engines with prompts relevant to your business and market. "Best plumber in Miami", "top-rated dentist near Coral Gables", etc. We record whether you're mentioned, how you're described, and how you compare to competitors.

### 2. Analyze — Find the Gaps
We identify which signals are strong, which are weak, and which are missing entirely. Common gaps include:
- No JSON-LD schema markup
- Missing or inconsistent business citations
- No llms.txt or agent.json files
- Thin content that doesn't demonstrate expertise

### 3. Optimize — Fix What Matters
We prioritize fixes based on impact. Structured data and citation consistency usually move the needle fastest. Content optimization and authority building are ongoing.

### 4. Monitor — Track Changes
AI visibility changes weekly as models update. We run continuous scans to ensure your visibility is growing, not shrinking.

---

**Ready to see how AI engines perceive your brand?** [Get your free AI visibility scan](/contact) — it takes 2 minutes to start.`,
    excerpt:
      "GEO (Generative Engine Optimization) is how you get AI engines like ChatGPT and Perplexity to recommend your business. Here's what you need to know.",
    author: "GEOPlusMarketing Team",
    tags: ["geo", "ai-search", "structured-data"],
    published_at: "2026-02-22T10:00:00Z",
    created_at: "2026-02-21T08:00:00Z",
  },
  {
    id: "content_003",
    business_id: "biz_001",
    title: "5 Signs Your Business Is Invisible to AI Search Engines",
    slug: "5-signs-your-business-is-invisible-to-ai-search",
    type: "blog",
    status: "published",
    body: `# 5 Signs Your Business Is Invisible to AI Search Engines

You might rank #1 on Google and still be completely invisible to ChatGPT, Perplexity, and Google's AI Overviews. Here's how to tell.

## 1. No Structured Data on Your Website

Check your website's source code. If you don't see JSON-LD schema markup (those \`<script type="application/ld+json">\` tags), AI engines have a much harder time understanding what your business does, where you're located, and what services you offer.

**Fix:** Add LocalBusiness, Service, and FAQ schema markup to every page.

## 2. You Don't Have an llms.txt File

Just like robots.txt tells search crawlers how to index your site, **llms.txt** tells AI models how to reference your business. If you don't have one, you're leaving it up to chance.

**Fix:** Create an llms.txt file at your domain root with your business name, services, location, and preferred citation format.

## 3. Inconsistent Business Citations

If your business name, address, and phone number (NAP) are different across Google Business Profile, Yelp, BBB, and industry directories, AI engines get confused about which information is correct.

**Fix:** Audit all your citations and ensure 100% NAP consistency.

## 4. Thin Content Without Expertise Signals

AI engines favor content that demonstrates genuine expertise — specific data points, case studies, original insights. If your blog is generic fluff, AI won't cite it.

**Fix:** Create authoritative content with specific examples, statistics, and real-world case studies from your market.

## 5. You've Never Tested It

The simplest sign: have you ever asked ChatGPT, Perplexity, or Google Gemini about your type of service in your city? If you haven't, you don't know what they're telling potential customers.

**Fix:** Try it right now. Ask "Who's the best [your service] in [your city]?" across multiple AI engines. If you're not mentioned, you have work to do.

---

**Want a comprehensive analysis?** Our [free AI visibility scan](/contact) checks your brand across every major AI engine and gives you a prioritized action plan.`,
    excerpt:
      "You might rank #1 on Google and still be completely invisible to ChatGPT and Perplexity. Here are 5 warning signs.",
    author: "GEOPlusMarketing Team",
    tags: ["ai-visibility", "geo", "diagnostics"],
    published_at: "2026-03-01T10:00:00Z",
    created_at: "2026-02-28T08:00:00Z",
  },
  {
    id: "content_004",
    business_id: "biz_001",
    title: "The ROI of AI Search Visibility: What the Data Shows",
    slug: "roi-of-ai-search-visibility-what-data-shows",
    type: "blog",
    status: "draft",
    body: `# The ROI of AI Search Visibility: What the Data Shows

Is investing in AI search visibility worth it? Let's look at the numbers.

## The Shifting Search Landscape

McKinsey projects that **$750 billion in US revenue** is at risk from AI-driven search disruption by 2028. That's not a hypothetical — it's already happening.

Businesses that get ahead of this shift are seeing:
- Higher quality leads (AI-referred visitors have stronger intent)
- Lower customer acquisition costs (AI citations are free — no ad spend)
- Compounding authority (once AI trusts your brand, it keeps citing you)

## What GEO Clients Typically See

Within the first 90 days of implementing a full GEO strategy:
- **2-3x increase** in AI mentions across major engines
- **35-50% more** inbound inquiries from AI-referred traffic
- **Higher close rates** on AI-sourced leads vs. traditional channels

## The Cost of Waiting

Every month you delay, your competitors are building their AI authority. Once an AI engine learns to recommend a competitor for your service category, displacing them gets harder — not easier. This is a first-mover market.

---

**See where you stand today.** [Get your free AI visibility scan](/contact).`,
    excerpt:
      "McKinsey projects $750B in US revenue at risk from AI search disruption. Here's what investing in AI visibility actually returns.",
    author: "GEOPlusMarketing Team",
    tags: ["roi", "ai-search", "business-case"],
    published_at: null,
    created_at: "2026-03-03T08:00:00Z",
  },
];

// --- Demo Campaigns ---

export const demoCampaigns: Campaign[] = [
  {
    id: "camp_001",
    business_id: "biz_001",
    name: "AI Visibility Awareness — Miami",
    type: "seo",
    status: "active",
    budget: 3500,
    spent: 2100,
    leads_generated: 18,
    impressions: 52000,
    clicks: 2340,
    start_date: "2026-01-15T00:00:00Z",
    end_date: null,
    created_at: "2026-01-14T10:00:00Z",
  },
  {
    id: "camp_002",
    business_id: "biz_001",
    name: "GEO Education Content — LinkedIn",
    type: "social",
    status: "active",
    budget: 1500,
    spent: 820,
    leads_generated: 7,
    impressions: 34000,
    clicks: 1120,
    start_date: "2026-02-01T00:00:00Z",
    end_date: "2026-04-30T00:00:00Z",
    created_at: "2026-01-30T10:00:00Z",
  },
];

// --- Demo Dashboard Stats ---

export const demoDashboardStats: DashboardStats = {
  total_leads: 42,
  leads_this_month: 11,
  total_content: 4,
  published_content: 3,
  active_campaigns: 2,
  total_revenue: 28500,
  conversion_rate: 22.5,
  avg_lead_value: 1850,
};
