import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const getLeadsTool = tool({
  description:
    "Get the franchisee's leads (businesses that have shown interest in buying GEO services). Use when the user asks to see leads, check pipeline, or review lead status. Does NOT return prospects (outreach targets).",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    status: z
      .enum(["new", "contacted", "qualified", "proposal", "won", "lost"])
      .optional()
      .describe("Filter by lead status"),
    businessId: z.string().optional().describe("Filter by specific business ID"),
  }),
  execute: async (params) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();

    // Get all businesses for this franchisee
    const { data: businesses, error: bizError } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("telegram_user_id", params.telegramUserId);

    if (bizError) return { success: false, error: bizError.message };
    if (!businesses || businesses.length === 0) {
      return {
        success: true,
        leads: [],
        message: "No businesses registered yet. Register a client business first to track leads.",
      };
    }

    const businessIds = params.businessId
      ? [params.businessId]
      : businesses.map((b) => b.id);

    let query = supabase
      .from("leads")
      .select("*")
      .in("business_id", businessIds)
      .order("created_at", { ascending: false });

    if (params.status) {
      query = query.eq("status", params.status);
    }

    const { data: leads, error: leadError } = await query;

    if (leadError) return { success: false, error: leadError.message };

    const businessMap = Object.fromEntries(businesses.map((b) => [b.id, b.name]));

    return {
      success: true,
      leads: (leads || []).map((l) => ({
        ...l,
        businessName: businessMap[l.business_id] || "Unknown",
      })),
      total: leads?.length || 0,
      statusFilter: params.status || "all",
    };
  },
});
