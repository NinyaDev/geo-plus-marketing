import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { researchModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const prospectBusinessesTool = tool({
  description:
    "Scraping agent: search a local region for high-converting prospect businesses (those with bad websites, weak Google Business Profiles, low reviews). Uses Grok for research intelligence. Stores prospects as leads.",
  inputSchema: z.object({
    businessId: z
      .string()
      .describe("Your business ID (the prospector's business)"),
    city: z.string().describe("Target city to prospect"),
    zipCode: z.string().optional().describe("Target ZIP code"),
    serviceType: z
      .string()
      .describe("Service type to prospect (e.g., 'plumber', 'dentist')"),
    radius: z
      .enum(["5mi", "10mi", "25mi", "50mi"])
      .default("10mi")
      .describe("Search radius"),
  }),
  execute: async (params) => {
    const prompt = `You are a business prospecting analyst. Find REAL ${params.serviceType} businesses in ${params.city}${params.zipCode ? ` (ZIP: ${params.zipCode})` : ""} within a ${params.radius} radius.

IMPORTANT: Only list businesses you are confident actually exist. Include their real website URL and phone number if you know them. If you are unsure about a business, mark it as "unverified". Do NOT invent fake businesses.

For each prospect, provide:

1. **Business Name** — the real business name
2. **Website URL** — their actual website (or "unknown" if you don't know it)
3. **Phone** — their real phone number (or "unknown")
4. **Website Assessment** — rate their likely online presence (1-10)
5. **GBP Assessment** — rate their Google Business Profile (1-10): review count, completeness
6. **Overall Quality Score** (1-10) — how good a prospect they are (higher = they NEED marketing help)
7. **Key Weaknesses** — specific issues or likely gaps in their online presence
8. **Recommended Approach** — how to pitch AI search visibility services to them
9. **Verified** — true if you are confident this business exists, false if uncertain

Focus on identifying businesses that likely:
- Have outdated or basic websites
- Have few Google reviews
- Are not ranking well for local keywords
- Would benefit from AI search visibility

Return 5-8 prospects. Format as JSON array with fields: name, website_url, phone, website_assessment, gbp_assessment, quality_score, weaknesses, recommended_approach, estimated_city, verified`;

    const result = await generateText({
      model: researchModel,
      prompt,
    });

    // Parse prospects from response
    let prospects: Array<{
      name: string;
      website_url?: string;
      phone?: string;
      quality_score: number;
      weaknesses: string;
      recommended_approach: string;
      estimated_city: string;
      verified?: boolean;
    }> = [];

    try {
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        prospects = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parse fails, return raw analysis
      return {
        success: true,
        rawAnalysis: result.text,
        message: "Prospects analyzed but could not be structured. See raw analysis.",
      };
    }

    // Store prospects as leads
    if (isSupabaseConfigured() && prospects.length > 0) {
      const supabase = getSupabaseAdmin();
      const leadsToInsert = prospects.map((p) => ({
        business_id: params.businessId,
        source: "prospector" as const,
        name: p.name,
        city: p.estimated_city || params.city,
        quality_score: p.quality_score,
        notes: `Weaknesses: ${p.weaknesses}\nApproach: ${p.recommended_approach}`,
        status: "new",
        metadata: p,
      }));

      await supabase.from("leads").insert(leadsToInsert);
    }

    return {
      success: true,
      city: params.city,
      serviceType: params.serviceType,
      prospectsFound: prospects.length,
      prospects: prospects.map((p) => ({
        name: p.name,
        websiteUrl: p.website_url || "unknown",
        phone: p.phone || "unknown",
        qualityScore: p.quality_score,
        weaknesses: p.weaknesses,
        approach: p.recommended_approach,
        verified: p.verified ?? false,
      })),
    };
  },
});
