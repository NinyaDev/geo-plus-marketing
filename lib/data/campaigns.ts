import { isSupabaseConfigured } from "../supabase/client";
import { demoCampaigns, type Campaign } from "./demo-data";

export async function getCampaigns(businessId?: string): Promise<Campaign[]> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      const query = supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (businessId) query.eq("business_id", businessId);
      const { data } = await query;
      if (data?.length) return data as Campaign[];
    } catch {
      // fall through to demo data
    }
  }
  return demoCampaigns;
}
