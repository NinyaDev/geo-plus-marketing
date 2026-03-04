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
  business_id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  service_type: string;
  city: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
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
  name: "Sunshine Plumbing",
  slug: "sunshine-plumbing",
  city: "Miami",
  state: "FL",
  phone: "3055551234",
  email: "info@sunshineplumbing.com",
  website: "https://sunshineplumbing.com",
  services: [
    "Emergency Plumbing",
    "Water Heater Installation",
    "Drain Cleaning",
    "Pipe Repair",
    "Bathroom Remodeling",
  ],
  description:
    "Miami's trusted plumbing experts. 24/7 emergency service, licensed & insured, serving all of Miami-Dade County.",
  created_at: "2025-01-15T10:00:00Z",
};

// --- Demo Leads ---

export const demoLeads: Lead[] = [
  {
    id: "lead_001",
    business_id: "biz_001",
    name: "Maria Rodriguez",
    email: "maria.r@email.com",
    phone: "3055559876",
    business_name: "",
    service_type: "Emergency Plumbing",
    city: "Miami",
    message: "Burst pipe in kitchen, need urgent help!",
    status: "converted",
    source: "landing_page",
    created_at: "2026-02-28T14:30:00Z",
  },
  {
    id: "lead_002",
    business_id: "biz_001",
    name: "James Thompson",
    email: "j.thompson@email.com",
    phone: "3055554321",
    business_name: "Thompson Properties",
    service_type: "Water Heater Installation",
    city: "Coral Gables",
    message: "Looking to replace old water heater in rental property.",
    status: "qualified",
    source: "blog",
    created_at: "2026-03-01T09:15:00Z",
  },
  {
    id: "lead_003",
    business_id: "biz_001",
    name: "Ana Gutierrez",
    email: "ana.g@email.com",
    phone: "3055558765",
    business_name: "",
    service_type: "Drain Cleaning",
    city: "Miami Beach",
    message: "Slow drain in bathroom, getting worse.",
    status: "contacted",
    source: "google",
    created_at: "2026-03-02T11:45:00Z",
  },
  {
    id: "lead_004",
    business_id: "biz_001",
    name: "Robert Chen",
    email: "r.chen@email.com",
    phone: "3055553456",
    business_name: "Chen Restaurant Group",
    service_type: "Pipe Repair",
    city: "Doral",
    message: "Need commercial pipe inspection and repair for restaurant.",
    status: "new",
    source: "contact_form",
    created_at: "2026-03-03T16:20:00Z",
  },
  {
    id: "lead_005",
    business_id: "biz_001",
    name: "Sarah Miller",
    email: "sarah.m@email.com",
    phone: "3055557654",
    business_name: "",
    service_type: "Bathroom Remodeling",
    city: "Kendall",
    message: "Interested in full bathroom remodel, 2 bathrooms.",
    status: "new",
    source: "social_media",
    created_at: "2026-03-04T08:00:00Z",
  },
];

// --- Demo Content ---

export const demoContent: ContentPiece[] = [
  {
    id: "content_001",
    business_id: "biz_001",
    title: "5 Signs You Need Emergency Plumbing in Miami",
    slug: "5-signs-you-need-emergency-plumbing-in-miami",
    type: "blog",
    status: "published",
    body: `# 5 Signs You Need Emergency Plumbing in Miami

Living in Miami means dealing with unique plumbing challenges — from aging pipes in older homes to tropical storm damage. Here are five signs you need to call an emergency plumber right away.

## 1. Burst or Leaking Pipes

If you notice water spraying from a pipe or a sudden drop in water pressure, you likely have a burst pipe. This can cause significant water damage in minutes. **Shut off your main water valve immediately** and call a licensed plumber.

## 2. Sewage Backup

A sewage backup is not just unpleasant — it's a health hazard. If you notice foul odors, gurgling drains, or sewage coming up through floor drains, this is an emergency that requires immediate professional attention.

## 3. No Hot Water

While not always an emergency, losing hot water completely can indicate a failing water heater. In some cases, a leaking water heater can cause flooding and even pose a safety risk if it's gas-powered.

## 4. Flooding from Appliances

Washing machines, dishwashers, and water heaters can all fail and cause flooding. If you notice standing water around any appliance, disconnect it from power if safe to do so and call for help.

## 5. Persistent Drain Clogs

A single slow drain is usually a minor issue, but if multiple drains in your home are slow or clogged simultaneously, this could indicate a main sewer line problem — a serious issue that needs professional diagnosis.

---

**Don't wait until a small issue becomes a disaster.** Sunshine Plumbing offers 24/7 emergency service across Miami-Dade County. Call us at (305) 555-1234 for fast, reliable plumbing help.`,
    excerpt:
      "Living in Miami means dealing with unique plumbing challenges. Here are five signs you need to call an emergency plumber right away.",
    author: "Sunshine Plumbing Team",
    tags: ["emergency-plumbing", "miami", "plumbing-tips"],
    published_at: "2026-02-15T10:00:00Z",
    created_at: "2026-02-14T08:00:00Z",
  },
  {
    id: "content_002",
    business_id: "biz_001",
    title: "Water Heater Buying Guide: Tank vs. Tankless in South Florida",
    slug: "water-heater-buying-guide-tank-vs-tankless-south-florida",
    type: "blog",
    status: "published",
    body: `# Water Heater Buying Guide: Tank vs. Tankless in South Florida

Choosing the right water heater for your South Florida home is a big decision. Let's break down the pros and cons of tank and tankless systems.

## Tank Water Heaters

**Pros:**
- Lower upfront cost ($800–$1,500 installed)
- Simple installation and maintenance
- Works well for homes with consistent hot water usage

**Cons:**
- Higher monthly energy bills
- Takes up more space
- 10–15 year lifespan

## Tankless Water Heaters

**Pros:**
- Energy efficient — heats water on demand
- Compact, wall-mounted design
- 20+ year lifespan
- Unlimited hot water

**Cons:**
- Higher upfront cost ($2,000–$4,500 installed)
- May require electrical or gas line upgrades
- Flow rate limitations with multiple simultaneous uses

## South Florida Considerations

Our warm climate actually gives tankless heaters an advantage — the incoming water temperature is already warmer, so the unit works less to heat it. This means even better energy savings compared to northern states.

## Our Recommendation

For most Miami homes, we recommend a **tankless water heater** for long-term savings and reliability. The higher upfront cost pays for itself within 5–7 years through energy savings.

---

**Ready to upgrade?** Call Sunshine Plumbing at (305) 555-1234 for a free water heater consultation.`,
    excerpt:
      "Choosing the right water heater for your South Florida home is a big decision. Let's break down the pros and cons.",
    author: "Sunshine Plumbing Team",
    tags: ["water-heater", "south-florida", "buying-guide"],
    published_at: "2026-02-22T10:00:00Z",
    created_at: "2026-02-21T08:00:00Z",
  },
  {
    id: "content_003",
    business_id: "biz_001",
    title: "How to Prevent Drain Clogs: A Miami Homeowner's Guide",
    slug: "how-to-prevent-drain-clogs-miami-homeowners-guide",
    type: "blog",
    status: "published",
    body: `# How to Prevent Drain Clogs: A Miami Homeowner's Guide

Drain clogs are one of the most common plumbing issues we see. The good news? Most clogs are preventable with a few simple habits.

## Kitchen Drains

- **Never pour grease down the drain.** Let it cool and dispose of it in the trash.
- Use a drain strainer to catch food particles.
- Run hot water for 30 seconds after using the disposal.

## Bathroom Drains

- Install hair catchers in showers and tubs.
- Clean pop-up stoppers in sinks monthly.
- Avoid flushing anything other than toilet paper.

## Outdoor Drains

Miami's tropical vegetation can clog outdoor drains with leaves and debris. Keep drains clear, especially before hurricane season.

## When to Call a Professional

If you notice slow drains in multiple fixtures, or if plunging doesn't resolve the issue, it's time to call a professional. This could indicate a deeper issue in your main sewer line.

---

**Need help with a stubborn clog?** Sunshine Plumbing has the tools and expertise to clear any drain. Call (305) 555-1234.`,
    excerpt:
      "Drain clogs are one of the most common plumbing issues. Most clogs are preventable with a few simple habits.",
    author: "Sunshine Plumbing Team",
    tags: ["drain-cleaning", "plumbing-tips", "miami"],
    published_at: "2026-03-01T10:00:00Z",
    created_at: "2026-02-28T08:00:00Z",
  },
  {
    id: "content_004",
    business_id: "biz_001",
    title: "Spring Plumbing Checklist for Miami Homes",
    slug: "spring-plumbing-checklist-miami-homes",
    type: "blog",
    status: "draft",
    body: `# Spring Plumbing Checklist for Miami Homes

Spring is the perfect time to give your plumbing system a checkup before the intense summer heat and hurricane season arrive.

## Indoor Checklist

- [ ] Check all faucets for drips or leaks
- [ ] Test water heater temperature (should be 120°F)
- [ ] Inspect washing machine hoses for bulges or cracks
- [ ] Clean showerheads with vinegar to remove mineral buildup
- [ ] Test all toilets for running water or phantom flushes

## Outdoor Checklist

- [ ] Inspect outdoor faucets and hose bibs
- [ ] Clear debris from outdoor drains and gutters
- [ ] Check sprinkler system for leaks or broken heads
- [ ] Inspect visible pipes for corrosion

## Hurricane Prep

- Know where your main water shutoff valve is
- Consider installing a sump pump if you don't have one
- Have a plumber inspect your backflow preventer

---

**Schedule your spring plumbing inspection today.** Call Sunshine Plumbing at (305) 555-1234.`,
    excerpt:
      "Spring is the perfect time to give your plumbing system a checkup before summer heat and hurricane season.",
    author: "Sunshine Plumbing Team",
    tags: ["plumbing-maintenance", "miami", "spring-checklist"],
    published_at: null,
    created_at: "2026-03-03T08:00:00Z",
  },
];

// --- Demo Campaigns ---

export const demoCampaigns: Campaign[] = [
  {
    id: "camp_001",
    business_id: "biz_001",
    name: "Miami Emergency Plumbing SEO",
    type: "seo",
    status: "active",
    budget: 2500,
    spent: 1875,
    leads_generated: 23,
    impressions: 45200,
    clicks: 1890,
    start_date: "2026-01-15T00:00:00Z",
    end_date: null,
    created_at: "2026-01-14T10:00:00Z",
  },
  {
    id: "camp_002",
    business_id: "biz_001",
    name: "South Florida Water Heater Social",
    type: "social",
    status: "active",
    budget: 1200,
    spent: 680,
    leads_generated: 8,
    impressions: 28500,
    clicks: 945,
    start_date: "2026-02-01T00:00:00Z",
    end_date: "2026-04-30T00:00:00Z",
    created_at: "2026-01-30T10:00:00Z",
  },
];

// --- Demo Dashboard Stats ---

export const demoDashboardStats: DashboardStats = {
  total_leads: 47,
  leads_this_month: 12,
  total_content: 4,
  published_content: 3,
  active_campaigns: 2,
  total_revenue: 34500,
  conversion_rate: 18.5,
  avg_lead_value: 734,
};
