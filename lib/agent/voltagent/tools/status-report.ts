import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const generateStatusReportTool = tool({
  description:
    "Generate a comprehensive status report for a business — aggregates leads, content created, campaigns, and analytics over a given period.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID"),
    period: z
      .enum(["7d", "30d", "90d"])
      .default("30d")
      .describe("Reporting period"),
  }),
  execute: async (params) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();
    const sinceMs =
      params.period === "7d"
        ? 7 * 86400000
        : params.period === "30d"
          ? 30 * 86400000
          : 90 * 86400000;
    const since = new Date(Date.now() - sinceMs).toISOString();

    // Fetch all data in parallel
    const [businessRes, leadsRes, contentRes, campaignsRes, analyticsRes] =
      await Promise.all([
        supabase.from("businesses").select("*").eq("id", params.businessId).single(),
        supabase
          .from("leads")
          .select("*")
          .eq("business_id", params.businessId)
          .gte("created_at", since),
        supabase
          .from("content")
          .select("*")
          .eq("business_id", params.businessId)
          .gte("created_at", since),
        supabase
          .from("campaigns")
          .select("*")
          .eq("business_id", params.businessId)
          .gte("created_at", since),
        supabase
          .from("analytics")
          .select("*")
          .eq("business_id", params.businessId)
          .gte("created_at", since),
      ]);

    const business = businessRes.data;
    const leads = leadsRes.data || [];
    const content = contentRes.data || [];
    const campaigns = campaignsRes.data || [];
    const analytics = analyticsRes.data || [];

    // Content breakdown by type
    const contentByType: Record<string, number> = {};
    for (const c of content) {
      contentByType[c.type] = (contentByType[c.type] || 0) + 1;
    }

    // Leads breakdown
    const leadsBySource: Record<string, number> = {};
    const leadsByStatus: Record<string, number> = {};
    for (const l of leads) {
      leadsBySource[l.source] = (leadsBySource[l.source] || 0) + 1;
      leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1;
    }

    return {
      success: true,
      report: {
        business: business
          ? { name: business.name, service: business.service_type, city: business.city }
          : null,
        period: params.period,
        summary: {
          totalLeads: leads.length,
          totalContent: content.length,
          activeCampaigns: campaigns.filter((c) => c.status !== "completed").length,
          analyticsEntries: analytics.length,
        },
        leads: {
          total: leads.length,
          bySource: leadsBySource,
          byStatus: leadsByStatus,
          newThisPeriod: leads.filter((l) => l.status === "new").length,
        },
        content: {
          total: content.length,
          byType: contentByType,
          drafts: content.filter((c) => c.status === "draft").length,
          published: content.filter((c) => c.status === "published").length,
        },
        campaigns: {
          total: campaigns.length,
          active: campaigns.filter((c) => c.status === "active").length,
          completed: campaigns.filter((c) => c.status === "completed").length,
        },
        generatedAt: new Date().toISOString(),
      },
    };
  },
});
