import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const buildCitationsTool = tool({
  description:
    "Build a comprehensive citation plan — directories, review sites, local publications, and niche platforms where the business should be listed for SEO and GEO.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID"),
    businessName: z.string().describe("Business name"),
    service: z.string().describe("Service type"),
    city: z.string().describe("City"),
    state: z.string().optional().describe("State"),
    website: z.string().optional().describe("Business website URL"),
    existingListings: z
      .array(z.string())
      .optional()
      .describe("Directories where already listed"),
  }),
  execute: async (params) => {
    const prompt = `Create a comprehensive citation building plan for "${params.businessName}", a ${params.service} business in ${params.city}${params.state ? `, ${params.state}` : ""}.
${params.website ? `Website: ${params.website}` : ""}
${params.existingListings?.length ? `Already listed on: ${params.existingListings.join(", ")}` : ""}

Provide a structured citation plan with:

## Tier 1: Essential Directories (must-have)
List 10-15 high-authority directories with:
- Directory name and URL
- Category to list under
- Priority (1-5)
- Estimated DA (Domain Authority)

## Tier 2: Industry-Specific Directories
List 5-10 directories specific to the ${params.service} industry

## Tier 3: Local Directories & Chambers
List 5-8 local ${params.city}-area directories, chambers of commerce, BBB, etc.

## Tier 4: Review Platforms
List 5-8 review platforms where the business should actively collect reviews

## Tier 5: AI Citation Sources
List 5-8 sources that AI engines (ChatGPT, Perplexity, Google AI) commonly cite for local business recommendations

## NAP Consistency Guidelines
Provide the exact Name, Address, Phone format to use consistently across all listings.

## Implementation Timeline
Week-by-week plan for building citations over 4-6 weeks.`;

    const result = await generateText({
      model: contentModel,
      prompt,
    });

    const plan = result.text;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      await supabase.from("content").insert({
        business_id: params.businessId,
        type: "blog_post",
        title: `Citation Building Plan — ${params.businessName}`,
        body: plan,
        target_city: params.city,
        target_service: params.service,
        status: "draft",
        metadata: { content_subtype: "citation_plan" },
      });
    }

    return { success: true, plan };
  },
});
