import { isSupabaseConfigured } from "../supabase/client";
import { demoLeads, type Lead } from "./demo-data";

export async function getLeads(businessId?: string): Promise<Lead[]> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      const query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (businessId) query.eq("business_id", businessId);
      const { data } = await query;
      if (data?.length) return data as Lead[];
    } catch {
      // fall through to demo data
    }
  }
  return demoLeads;
}

export async function createLead(
  lead: Omit<Lead, "id" | "created_at" | "status">
): Promise<{ success: boolean; lead?: Lead; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("leads")
        .insert({ ...lead, status: "new" })
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      return { success: true, lead: data as Lead };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
  // Without DB, return a mock success
  const mockLead: Lead = {
    ...lead,
    id: `lead_${Date.now()}`,
    status: "new",
    created_at: new Date().toISOString(),
  };
  return { success: true, lead: mockLead };
}
