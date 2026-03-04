import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const runGeoAuditTool = tool({
  description:
    "Run a Generative Engine Optimization (GEO) audit — check if a business appears in AI-generated answers (ChatGPT, Google AI Overviews, Perplexity). Scores visibility and provides recommendations.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID"),
    businessName: z.string().describe("Business name"),
    service: z.string().describe("Primary service type"),
    city: z.string().describe("Primary city"),
    competitors: z
      .array(z.string())
      .optional()
      .describe("Known competitor names"),
  }),
  execute: async (params) => {
    const prompt = `You are a Generative Engine Optimization (GEO) analyst. Perform a comprehensive GEO audit for "${params.businessName}", a ${params.service} business in ${params.city}.

Analyze the business's likely AI visibility across these engines:
1. **ChatGPT** — Would ChatGPT mention this business by name when asked about ${params.service} in ${params.city}?
2. **Google AI Overviews** — Would the AI Overview feature include this business?
3. **Perplexity** — Would Perplexity cite this business in answers?

For each engine, score:
- **mentioned_by_name** (10 pts) — AI names the business specifically
- **mentioned_generically** (5 pts) — AI describes services matching this business but doesn't name it
- **not_mentioned** (0 pts) — Business doesn't appear at all

Then provide:
1. **Overall GEO Score** (0-30) — sum of all three engine scores
2. **GEO Grade** — A (25-30), B (18-24), C (10-17), D (5-9), F (0-4)
3. **Key Findings** — What's working and what's not
4. **Top 5 GEO Recommendations** — Specific, actionable steps to improve AI visibility
5. **Content Gaps** — Topics/pages the business should create for better AI inclusion
6. **Citation Opportunities** — Where the business should be listed to get cited by AI engines

${params.competitors?.length ? `Known competitors: ${params.competitors.join(", ")}` : ""}

Format your response as a structured report.`;

    const result = await generateText({
      model: contentModel,
      prompt,
    });

    const audit = result.text;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      await supabase.from("analytics").insert({
        business_id: params.businessId,
        metric_type: "geo_audit",
        metric_value: {
          business_name: params.businessName,
          service: params.service,
          city: params.city,
          audit_text: audit,
          audited_at: new Date().toISOString(),
        },
        source: "geo_audit_tool",
      });
    }

    return {
      success: true,
      businessName: params.businessName,
      service: params.service,
      city: params.city,
      audit,
    };
  },
});
