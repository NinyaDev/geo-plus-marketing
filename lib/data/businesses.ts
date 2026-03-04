import { isSupabaseConfigured } from "../supabase/client";
import { demoBusiness, type Business } from "./demo-data";

export async function getBusiness(id?: string): Promise<Business | null> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      const query = supabase.from("businesses").select("*");
      if (id) query.eq("id", id);
      const { data } = await query.limit(1).single();
      if (data) return data as Business;
    } catch {
      // fall through to demo data
    }
  }
  return demoBusiness;
}
