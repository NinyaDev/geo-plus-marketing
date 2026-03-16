import { isSupabaseConfigured } from "../supabase/client";
import { demoDashboardStats, type DashboardStats } from "./demo-data";

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();

      const [leads, content] = await Promise.all([
        supabase.from("leads").select("id, status"),
        supabase.from("content").select("id, status"),
      ]);

      if (leads.data && content.data) {
        return {
          total_leads: leads.data.filter((l) => l.status === "lead").length,
          total_prospects: leads.data.filter(
            (l) => l.status === "prospect" || l.status === "contacted"
          ).length,
          published_content: content.data.filter((c) => c.status === "published").length,
          total_content: content.data.length,
        };
      }
    } catch {
      // fall through to demo data
    }
  }
  return demoDashboardStats;
}
