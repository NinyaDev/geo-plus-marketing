import { tool } from "ai";
import { z } from "zod";
import { getConfig } from "@/lib/config";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const generateCtaImageTool = tool({
  description:
    "Generate CTA advertising visuals, social media graphics, or banner ads using Google Gemini (Nano Banana Pro 2) image generation.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID"),
    service: z.string().describe("Service type to visualize"),
    city: z.string().describe("Target city for geo-targeting"),
    imageType: z
      .enum(["ad", "social", "banner"])
      .describe("Type of image to generate"),
    aspectRatio: z
      .enum(["1:1", "16:9", "9:16", "4:3"])
      .default("1:1")
      .describe("Image aspect ratio"),
    style: z
      .enum(["professional", "modern", "bold", "minimal", "warm"])
      .default("professional")
      .describe("Visual style"),
    headline: z.string().optional().describe("CTA headline text to include"),
    businessName: z.string().optional().describe("Business name to include"),
  }),
  execute: async (params) => {
    const config = getConfig();

    if (!config.google.apiKey) {
      return {
        success: false,
        error:
          "Google API key not configured. Set GOOGLE_API_KEY to enable image generation.",
      };
    }

    const typeDescriptions: Record<string, string> = {
      ad: "A professional advertising graphic with a clear call-to-action",
      social: "An engaging social media post image",
      banner: "A wide banner image suitable for website headers or email",
    };

    const imagePrompt = `${typeDescriptions[params.imageType]} for a ${params.service} business in ${params.city}. Style: ${params.style}. ${params.headline ? `Include the text: "${params.headline}".` : ""} ${params.businessName ? `Business: ${params.businessName}.` : ""} The design should feel local and trustworthy, using imagery associated with ${params.city}. Professional quality, high contrast, clear typography if text is included.`;

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: config.google.apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: imagePrompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      // Extract image from response
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(
        (p) => "inlineData" in p
      );

      if (!imagePart || !("inlineData" in imagePart)) {
        return {
          success: false,
          error: "Image generation did not return an image. Try a different prompt.",
          promptUsed: imagePrompt,
        };
      }

      const inlineData = imagePart.inlineData as { data: string; mimeType: string };
      const base64Image = `data:${inlineData.mimeType};base64,${inlineData.data}`;

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        await supabase.from("content").insert({
          business_id: params.businessId,
          type: "cta_image",
          title: `${params.imageType} — ${params.service} in ${params.city}`,
          body: imagePrompt,
          image_url: base64Image.substring(0, 200) + "...[base64]",
          target_city: params.city,
          target_service: params.service,
          status: "draft",
          metadata: {
            aspect_ratio: params.aspectRatio,
            style: params.style,
            image_type: params.imageType,
          },
        });
      }

      return {
        success: true,
        imageType: params.imageType,
        style: params.style,
        aspectRatio: params.aspectRatio,
        promptUsed: imagePrompt,
        base64Image,
        message: "CTA image generated successfully!",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Image generation failed: ${errorMessage}`,
        promptUsed: imagePrompt,
      };
    }
  },
});
