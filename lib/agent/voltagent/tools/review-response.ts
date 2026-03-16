import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

export const draftReviewResponseTool = tool({
  description:
    "Draft a professional response to a customer review that includes local SEO keywords. Auto-selects tone based on review rating.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    reviewText: z.string().describe("The customer review text"),
    reviewRating: z.number().min(1).max(5).describe("Star rating (1-5)"),
    platform: z
      .enum(["google", "yelp", "facebook"])
      .default("google")
      .describe("Review platform"),
    reviewerName: z.string().optional().describe("Name of the reviewer"),
    businessName: z.string().optional().describe("Business name"),
    service: z.string().optional().describe("Primary service type"),
    city: z.string().optional().describe("Business city"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    const toneMap: Record<number, string> = {
      1: "empathetic, apologetic, solution-oriented. Acknowledge the issue, express genuine concern, offer to make it right. Do NOT be defensive.",
      2: "understanding, professional, constructive. Acknowledge disappointment, explain improvements being made.",
      3: "appreciative, constructive. Thank them, acknowledge feedback, highlight positives.",
      4: "warm, grateful, encouraging. Thank them enthusiastically, subtly mention services.",
      5: "enthusiastic, grateful, celebratory. Express genuine thanks, mention the specific service, encourage referrals.",
    };

    const tone = toneMap[params.reviewRating] || toneMap[3];

    const prompt = `Write a review response for a ${params.reviewRating}-star review on ${params.platform}.

Review: "${params.reviewText}"
${params.reviewerName ? `Reviewer: ${params.reviewerName}` : ""}
${params.businessName ? `Business: ${params.businessName}` : ""}
${params.service ? `Service: ${params.service}` : ""}
${params.city ? `City: ${params.city}` : ""}

Tone: ${tone}

Requirements:
- Address the reviewer by name if provided
- Naturally include the business name and service type for local SEO
- If city is provided, mention the area naturally
- Keep under 300 words
- Do NOT use generic templates — make it feel personal and specific to the review
- For negative reviews: offer to discuss offline (mention phone/email)
- For positive reviews: subtly encourage referrals`;

    const result = await generateText({
      model: contentModel,
      prompt,
    });

    const response = result.text;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      await supabase.from("content").insert({
        business_id: businessId,
        type: "review_response",
        title: `${params.reviewRating}★ Review Response — ${params.platform}`,
        body: response,
        platform: params.platform,
        metadata: {
          review_text: params.reviewText,
          review_rating: params.reviewRating,
          reviewer_name: params.reviewerName,
        },
        status: "draft",
      });
    }

    return {
      success: true,
      rating: params.reviewRating,
      platform: params.platform,
      response,
    };
  },
});
