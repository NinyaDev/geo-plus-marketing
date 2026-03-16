import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

export const getLeadsTool = tool({
  description:
    "Get ALL leads and prospects from the database. Use when the user asks to see leads, check pipeline, review status, or asks about contacts. Returns leads from all sources (bot, contact form, prospects).",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    status: z
      .enum(["lead", "prospect", "contacted"])
      .optional()
      .describe("Filter by status"),
  }),
  execute: async (params) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();

    // Resolve business ID (auto-creates if needed)
    const businessId = await getOrCreateBusinessId(params.telegramUserId);

    // Query ALL leads: those belonging to the franchisee's business + orphans (business_id is null)
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (businessId) {
      query = query.or(`business_id.eq.${businessId},business_id.is.null`);
    }

    if (params.status) {
      query = query.eq("status", params.status);
    }

    const { data: leads, error: leadError } = await query;

    if (leadError) return { success: false, error: leadError.message };

    return {
      success: true,
      leads: (leads || []).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        city: l.city,
        service_requested: l.service_requested,
        status: l.status,
        source: l.source,
        quality_score: l.quality_score,
        notes: l.notes,
        created_at: l.created_at,
      })),
      total: leads?.length || 0,
      statusFilter: params.status || "all",
    };
  },
});
