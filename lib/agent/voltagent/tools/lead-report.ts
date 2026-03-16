import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

export const generateLeadReportTool = tool({
  description:
    "Generate an aggregated lead report for a business — breakdown by source, status, quality score, and time period.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    period: z
      .enum(["7d", "30d", "90d", "all"])
      .default("30d")
      .describe("Reporting period"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();

    const periodMap: Record<string, string> = {
      "7d": new Date(Date.now() - 7 * 86400000).toISOString(),
      "30d": new Date(Date.now() - 30 * 86400000).toISOString(),
      "90d": new Date(Date.now() - 90 * 86400000).toISOString(),
      all: "1970-01-01T00:00:00Z",
    };

    const since = periodMap[params.period];

    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .eq("business_id", businessId)
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    if (!leads || leads.length === 0) {
      return {
        success: true,
        report: {
          total: 0,
          period: params.period,
          message: "No leads found for this period.",
        },
      };
    }

    // Aggregate by source
    const bySource: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalScore = 0;
    let scoredCount = 0;

    for (const lead of leads) {
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      if (lead.quality_score) {
        totalScore += lead.quality_score;
        scoredCount++;
      }
    }

    return {
      success: true,
      report: {
        total: leads.length,
        period: params.period,
        bySource,
        byStatus,
        avgQualityScore: scoredCount > 0 ? (totalScore / scoredCount).toFixed(1) : "N/A",
        recentLeads: leads.slice(0, 5).map((l) => ({
          name: l.name,
          source: l.source,
          status: l.status,
          score: l.quality_score,
          date: l.created_at,
        })),
      },
    };
  },
});
