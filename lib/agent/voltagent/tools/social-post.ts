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

export const createSocialPostTool = tool({
  description:
    "Create a platform-specific social media post (Google Business Profile, Instagram, or Facebook) for a local service business.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
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
    const businessId =
      params.businessId ||
      (await getOrCreateBusinessId(params.telegramUserId));

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

    let savedToDb = false;
    let saveError: string | undefined;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const title = `${params.platform.toUpperCase()} — ${params.postType} — ${params.service}`;
      const excerpt = post.replace(/[#*_`\n]/g, " ").trim().slice(0, 200);

      if (!businessId) {
        console.error("[SocialPost] businessId is null — will try insert without it");
      }

      const row: Record<string, unknown> = {
        type: "social",
        title,
        slug: generateSlug(`${params.platform} ${params.postType} ${params.service} ${params.city}`),
        body: post,
        target_city: params.city,
        target_service: params.service,
        platform: params.platform,
        status: "draft",
        metadata: {
          excerpt,
          author: "GEOPlusMarketing",
          tags: [params.platform, params.postType, params.city.toLowerCase()],
        },
      };
      if (businessId) row.business_id = businessId;

      let { error: insertError } = await supabase.from("content").insert(row);

      // If it failed because of business_id, retry without it
      if (insertError && businessId) {
        console.error("[SocialPost] Insert failed with business_id, retrying without:", insertError.message);
        delete row.business_id;
        ({ error: insertError } = await supabase.from("content").insert(row));
      }

      if (insertError) {
        console.error("[SocialPost] Supabase insert failed:", insertError.message);
        saveError = insertError.message;
      } else {
        savedToDb = true;
      }
    }

    const postingInstructions: Record<string, string> = {
      gbp: `How to post on Google Business Profile:
1. Go to business.google.com and sign in
2. Select the business profile
3. Click "Add update" (or "Create post")
4. Choose post type: Update, Offer, or Event
5. Paste the content above
6. Add a photo if available
7. Set the CTA button type and link
8. Click "Publish"

Direct link: https://business.google.com`,
      instagram: `How to post on Instagram:
1. Open Instagram app or go to instagram.com
2. Tap the + button to create a new post
3. Select or upload an image (use the suggested image description above)
4. Paste the caption from the content above
5. Add location tag for ${params.city}
6. Share to your feed

Direct link: https://instagram.com`,
      facebook: `How to post on Facebook:
1. Go to your Facebook Business Page
2. Click "Create post" at the top of the page
3. Paste the content above
4. Add a photo or link if suggested
5. Click "Post"

Direct link: https://facebook.com`,
    };

    return {
      success: true,
      savedToDb,
      ...(saveError ? { saveError } : {}),
      platform: params.platform,
      post,
      postingInstructions: postingInstructions[params.platform],
    };
  },
});
