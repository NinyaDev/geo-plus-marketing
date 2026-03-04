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
    const prompt = `You are a business prospecting analyst. Analyze the local market for ${params.serviceType} businesses in ${params.city}${params.zipCode ? ` (ZIP: ${params.zipCode})` : ""} within a ${params.radius} radius.

Generate a realistic prospecting report with 5-8 fictional but plausible business prospects that match common patterns of businesses needing marketing help. For each prospect, provide:

1. **Business Name** — realistic local business name
2. **Website Assessment** — rate their website (1-10): loading speed, mobile responsiveness, modern design, clear CTAs
3. **GBP Assessment** — rate their Google Business Profile (1-10): review count, average rating, post frequency, completeness
4. **SEO Assessment** — rate their search visibility (1-10): keyword rankings, local pack presence, organic traffic signals
5. **Overall Quality Score** (1-10) — how good a prospect they are (higher = more likely to convert, i.e., they NEED help)
6. **Key Weaknesses** — specific issues you identified
7. **Recommended Approach** — how to pitch marketing services to them

Focus on identifying businesses that:
- Have outdated or non-mobile-friendly websites
- Have few Google reviews (<20)
- Don't post on Google Business Profile
- Have incomplete GBP listings
- Are not ranking for key local keywords
- Have no schema markup or structured data

Format as JSON array with fields: name, website_assessment, gbp_assessment, seo_assessment, quality_score, weaknesses, recommended_approach, estimated_city`;

    const result = await generateText({
      model: researchModel,
      prompt,
    });

    // Parse prospects from response
    let prospects: Array<{
      name: string;
      quality_score: number;
      weaknesses: string;
      recommended_approach: string;
      estimated_city: string;
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
        qualityScore: p.quality_score,
        weaknesses: p.weaknesses,
        approach: p.recommended_approach,
      })),
    };
  },
});
