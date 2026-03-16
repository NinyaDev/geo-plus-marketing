import { isSupabaseConfigured } from "../supabase/client";
import { demoLeads, type Lead } from "./demo-data";

/** Get all leads/prospects/contacted (everything in the leads table) */
export async function getAllLeads(businessId?: string): Promise<Lead[]> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (businessId) query = query.eq("business_id", businessId);
      const { data } = await query;
      if (data) return data as Lead[];
    } catch {
      // fall through to demo data
    }
  }
  return demoLeads;
}

/** Get leads only (status = "lead") — used by dashboard data */
export async function getLeads(businessId?: string): Promise<Lead[]> {
  const all = await getAllLeads(businessId);
  return all.filter((l) => l.status === "lead");
}

/** Get prospects + contacted */
export async function getProspects(businessId?: string): Promise<Lead[]> {
  const all = await getAllLeads(businessId);
  return all.filter((l) => l.status === "prospect" || l.status === "contacted");
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
        .insert({ ...lead, status: "lead" })
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
    status: "lead",
    created_at: new Date().toISOString(),
  };
  return { success: true, lead: mockLead };
}
