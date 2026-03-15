import { tool } from "ai";
import { generateText } from "ai";
import { z } from "zod";
import { contentModel } from "../models";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export const generateGeoContentTool = tool({
  description:
    "Generate geo-targeted SEO content (blog post or landing page copy) for a local service business. Includes local landmarks, neighborhoods, FAQ, and CTAs.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID from the database"),
    service: z.string().describe("Service to write about (e.g., 'emergency plumbing')"),
    city: z.string().describe("Target city"),
    contentType: z
      .enum(["blog_post", "landing_page"])
      .describe("Type of content to generate"),
    tone: z
      .enum(["professional", "friendly", "authoritative", "casual"])
      .default("professional")
      .describe("Writing tone"),
    wordCount: z.number().default(800).describe("Approximate word count"),
  }),
  execute: async (params) => {
    const prompt = `Write a ${params.contentType === "blog_post" ? "blog post" : "landing page copy"} for a ${params.service} business in ${params.city}.

Requirements:
- Tone: ${params.tone}
- Approximate word count: ${params.wordCount}
- Include references to local neighborhoods and landmarks in ${params.city}
- Include a FAQ section with 3-5 common questions
- Include clear CTAs (call to action)
- Optimize for the keyword "${params.service} in ${params.city}"
- Include natural variations of the target keyword
- Write for both human readers and AI engines (GEO-optimized)
- Use headers (H2, H3) for structure
- Include a meta description suggestion at the top

Format the output in Markdown.`;

    const result = await generateText({
      model: contentModel,
      prompt,
    });

    const content = result.text;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const title = `${params.service} in ${params.city} — ${params.contentType === "blog_post" ? "Blog Post" : "Landing Page"}`;

      const { data } = await supabase
        .from("content")
        .insert({
          business_id: params.businessId,
          type: params.contentType,
          title,
          slug: generateSlug(title),
          body: content,
          target_keyword: `${params.service} in ${params.city}`,
          target_city: params.city,
          target_service: params.service,
          status: "draft",
        })
        .select()
        .single();

      return {
        success: true,
        contentId: data?.id,
        title,
        content,
        wordCount: content.split(/\s+/).length,
      };
    }

    return {
      success: true,
      content,
      wordCount: content.split(/\s+/).length,
    };
  },
});
