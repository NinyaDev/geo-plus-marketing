import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const createSocialPostTool = tool({
  description:
    "Create a platform-specific social media post (Google Business Profile, Instagram, or Facebook) for a local service business.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID"),
    platform: z
      .enum(["gbp", "instagram", "facebook"])
      .describe("Target social platform"),
    service: z.string().describe("Service to promote"),
    city: z.string().describe("Target city"),
    postType: z
      .enum(["promotion", "tip", "testimonial", "seasonal", "before_after"])
      .default("promotion")
      .describe("Type of post"),
    businessName: z.string().optional().describe("Business name for personalization"),
  }),
  execute: async (params) => {
    const platformGuide: Record<string, string> = {
      gbp: `Google Business Profile post:
- Max 1500 characters
- Include a strong CTA (Book Now, Call Today, Get Quote)
- Mention the business location and service area
- Professional tone, keyword-rich
- Include a suggested CTA button type (BOOK, CALL, LEARN_MORE)`,
      instagram: `Instagram post:
- Max 2200 characters for caption
- Start with a hook (first line is critical)
- Include 20-30 relevant hashtags (mix of broad and local)
- Use line breaks and emojis for readability
- Include a CTA directing to link in bio
- Suggest image description for pairing`,
      facebook: `Facebook post:
- Optimize for engagement (questions, polls, stories)
- 40-80 words ideal for engagement
- Include a CTA
- Suggest a post format (text, link, photo prompt)
- Conversational and community-focused tone`,
    };

    const prompt = `Create a ${params.postType} social media post for a ${params.service} business${params.businessName ? ` called "${params.businessName}"` : ""} in ${params.city}.

${platformGuide[params.platform]}

Make it geo-targeted to ${params.city} — mention local areas, seasonal relevance, or community events if applicable.`;

    const result = await generateText({
      model: contentModel,
      prompt,
    });

    const post = result.text;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      await supabase.from("content").insert({
        business_id: params.businessId,
        type: "social_post",
        title: `${params.platform.toUpperCase()} — ${params.postType} — ${params.service}`,
        body: post,
        target_city: params.city,
        target_service: params.service,
        platform: params.platform,
        status: "draft",
      });
    }

    return { success: true, platform: params.platform, post };
  },
});
