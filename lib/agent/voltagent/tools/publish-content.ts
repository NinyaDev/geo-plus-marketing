import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export const publishContentTool = tool({
  description:
    "Publish a draft content piece. Changes status to 'published', sets published_at timestamp, and generates a slug if missing. Use when the franchisee wants to publish content to the blog.",
  inputSchema: z.object({
    contentId: z.string().describe("ID of the content piece to publish"),
  }),
  execute: async (params) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();

    // Fetch existing content
    const { data: existing, error: fetchError } = await supabase
      .from("content")
      .select("id, title, slug, status")
      .eq("id", params.contentId)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: fetchError?.message ?? "Content not found" };
    }

    if (existing.status === "published") {
      return { success: false, error: "Content is already published" };
    }

    const slug = existing.slug || generateSlug(existing.title);

    const { data, error } = await supabase
      .from("content")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        slug,
      })
      .eq("id", params.contentId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: `"${data.title}" is now published!`,
      content: { id: data.id, title: data.title, slug: data.slug, status: data.status },
    };
  },
});

export const listContentTool = tool({
  description:
    "List content pieces for a client business. Optionally filter by status (draft/published) or type (blog_post/landing_page/social_post). Use when the franchisee wants to see drafts or published content.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    status: z
      .enum(["draft", "published"])
      .optional()
      .describe("Filter by status"),
    type: z
      .enum(["blog_post", "landing_page", "social_post"])
      .optional()
      .describe("Filter by content type"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("content")
      .select("id, title, type, status, slug, created_at, published_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (params.status) query = query.eq("status", params.status);
    if (params.type) query = query.eq("type", params.type);

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      content: data,
      count: data.length,
    };
  },
});
