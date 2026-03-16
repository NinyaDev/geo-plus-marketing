import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

export const createCampaignTool = tool({
  description:
    "Create a full marketing campaign — orchestrates content creation, landing page, social posts, schema markup, and CTA image into a unified campaign plan. Stores a campaign record linking all generated content.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    businessName: z.string().describe("Business name"),
    service: z.string().describe("Service to campaign for"),
    location: z.string().describe("Target city/location"),
    platforms: z
      .array(z.enum(["gbp", "instagram", "facebook"]))
      .default(["gbp"])
      .describe("Social platforms to create content for"),
    phone: z.string().optional().describe("Business phone"),
    website: z.string().optional().describe("Business website"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    // Generate a campaign plan using GPT-4o
    const prompt = `Create a detailed marketing campaign plan for "${params.businessName}", a ${params.service} business in ${params.location}.

Platforms: ${params.platforms.join(", ")}

Generate a structured campaign plan with:

1. **Campaign Name** — catchy, memorable name
2. **Campaign Goal** — specific, measurable objective
3. **Target Audience** — demographic and psychographic profile
4. **Content Calendar** (2-week plan):
   - Week 1: Launch phase content
   - Week 2: Engagement phase content
5. **Channel Strategy** for each platform: ${params.platforms.join(", ")}
6. **Key Messages** — 3-5 core messages
7. **CTA Strategy** — primary and secondary CTAs
8. **SEO/GEO Keywords** — 10 target keywords
9. **Success Metrics** — KPIs to track
10. **Budget Recommendations** (if applicable)

Make it specific to ${params.service} in ${params.location}.`;

    const result = await generateText({
      model: contentModel,
      prompt,
    });

    const campaignPlan = result.text;

    // Extract campaign name from the generated plan
    const nameMatch = campaignPlan.match(
      /Campaign Name[:\s]*\*?\*?([^\n*]+)/i
    );
    const campaignName =
      nameMatch?.[1]?.trim() ||
      `${params.service} Campaign — ${params.location}`;

    const steps = [
      { step: "campaign_plan", status: "completed", content: "Campaign plan generated" },
      { step: "geo_content", status: "pending", content: "Blog post / landing copy" },
      { step: "landing_page", status: "pending", content: "HTML landing page" },
      ...params.platforms.map((p) => ({
        step: `social_${p}`,
        status: "pending",
        content: `${p.toUpperCase()} social post`,
      })),
      { step: "schema_markup", status: "pending", content: "JSON-LD schema" },
      { step: "cta_image", status: "pending", content: "CTA visual" },
    ];

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("campaigns")
        .insert({
          business_id: businessId,
          name: campaignName,
          service: params.service,
          location: params.location,
          status: "planning",
          steps,
          metadata: {
            platforms: params.platforms,
            plan: campaignPlan,
          },
        })
        .select()
        .single();

      return {
        success: true,
        campaignId: data?.id,
        campaignName,
        steps,
        plan: campaignPlan,
        message: `Campaign "${campaignName}" created! Use individual tools (generate_geo_content, generate_landing_page, create_social_post, generate_schema, generate_cta_image) to execute each step.`,
      };
    }

    return {
      success: true,
      campaignName,
      steps,
      plan: campaignPlan,
    };
  },
});
