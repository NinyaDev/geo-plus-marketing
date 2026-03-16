import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Look up the franchisee's business by telegram user ID.
 * If none exists, auto-create a default one silently.
 * Returns the business ID or null if Supabase is not configured.
 */
export async function getOrCreateBusinessId(
  telegramUserId: string,
  firstName?: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseAdmin();

  // Look up existing business
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id")
    .eq("telegram_user_id", telegramUserId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (businesses && businesses.length > 0) return businesses[0].id;

  // Auto-create a default business
  const name = firstName ? `${firstName}'s GEO Services` : "GEO Services";
  const { data } = await supabase
    .from("businesses")
    .insert({
      telegram_user_id: telegramUserId,
      name,
      service_type: "GEO / AI Search Visibility",
      city: "Unknown",
    })
    .select("id")
    .single();

  return data?.id || null;
}
