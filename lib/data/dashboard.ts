import { isSupabaseConfigured } from "../supabase/client";
import { demoDashboardStats, type DashboardStats } from "./demo-data";

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();

      const [leads, content, campaigns] = await Promise.all([
        supabase.from("leads").select("id, status, created_at"),
        supabase.from("content").select("id, status"),
        supabase.from("campaigns").select("id, status, budget, spent, leads_generated"),
      ]);

      if (leads.data && content.data && campaigns.data) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
          total_leads: leads.data.length,
          leads_this_month: leads.data.filter(
            (l) => new Date(l.created_at) >= monthStart
          ).length,
          total_content: content.data.length,
          published_content: content.data.filter((c) => c.status === "published")
            .length,
          active_campaigns: campaigns.data.filter((c) => c.status === "active")
            .length,
          total_revenue: campaigns.data.reduce(
            (sum, c) => sum + (c.budget || 0),
            0
          ),
          conversion_rate: 18.5,
          avg_lead_value: 734,
        };
      }
    } catch {
      // fall through to demo data
    }
  }
  return demoDashboardStats;
}
