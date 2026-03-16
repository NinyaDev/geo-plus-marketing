import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export const generateLandingPageTool = tool({
  description:
    "Generate a complete, location-specific HTML landing page with LocalBusiness JSON-LD schema, FAQ section, and CTAs for a local service business.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    service: z.string().describe("Service to promote"),
    city: z.string().describe("Target city"),
    businessName: z.string().describe("Business name"),
    phone: z.string().optional().describe("Business phone number"),
    state: z.string().optional().describe("State"),
    zipCode: z.string().optional().describe("ZIP code"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    const prompt = `Generate a complete, production-ready HTML landing page for "${params.businessName}" — a ${params.service} business in ${params.city}${params.state ? `, ${params.state}` : ""}.

Requirements:
1. Full HTML document with <!DOCTYPE html>, <head>, <body>
2. Inline CSS (no external stylesheets) — modern, clean, mobile-responsive design
3. Sections:
   - Hero with headline, subheadline, CTA button
   - Services overview (4-6 service items with icons/emojis)
   - Why Choose Us (3-4 trust factors)
   - Service area (mention ${params.city} neighborhoods)
   - FAQ (5 common questions with answers)
   - Contact/CTA section${params.phone ? ` with phone: ${params.phone}` : ""}
   - Footer
4. LocalBusiness JSON-LD schema in <script type="application/ld+json">
5. Meta title and description optimized for "${params.service} in ${params.city}"
6. Open Graph tags
7. Color scheme: professional blues/greens appropriate for service business

Output ONLY the HTML code, no markdown wrapping.`;

    const result = await generateText({
      model: contentModel,
      prompt,
      maxOutputTokens: 4000,
    });

    const html = result.text;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("content")
        .insert({
          business_id: businessId,
          type: "landing_page",
          title: `${params.service} in ${params.city} — Landing Page`,
          slug: generateSlug(`${params.service} in ${params.city} Landing Page`),
          body: html,
          target_city: params.city,
          target_service: params.service,
          status: "draft",
        })
        .select()
        .single();

      return {
        success: true,
        contentId: data?.id,
        title: `${params.service} in ${params.city}`,
        htmlLength: html.length,
        html,
      };
    }

    return { success: true, html, htmlLength: html.length };
  },
});
