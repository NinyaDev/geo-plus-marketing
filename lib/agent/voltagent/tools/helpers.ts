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
  const { data: businesses, error: lookupErr } = await supabase
    .from("businesses")
    .select("id")
    .eq("telegram_user_id", telegramUserId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (lookupErr) {
    console.error("[BusinessHelper] Lookup failed:", lookupErr.message);
  }

  if (businesses && businesses.length > 0) {
    console.log(`[BusinessHelper] Found business ${businesses[0].id} for user ${telegramUserId}`);
    return businesses[0].id;
  }

  // Auto-create a default business
  const name = firstName ? `${firstName}'s GEO Services` : "GEO Services";
  console.log(`[BusinessHelper] No business found for user ${telegramUserId}, creating one...`);
  const { data, error: insertErr } = await supabase
    .from("businesses")
    .insert({
      telegram_user_id: telegramUserId,
      name,
      service_type: "GEO / AI Search Visibility",
      city: "Unknown",
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error("[BusinessHelper] Auto-create failed:", insertErr.message);
    // Retry lookup in case another request created it concurrently
    const { data: retryLookup } = await supabase
      .from("businesses")
      .select("id")
      .eq("telegram_user_id", telegramUserId)
      .limit(1);
    if (retryLookup && retryLookup.length > 0) {
      console.log(`[BusinessHelper] Found business on retry: ${retryLookup[0].id}`);
      return retryLookup[0].id;
    }
    return null;
  }

  console.log(`[BusinessHelper] Created business ${data?.id} for user ${telegramUserId}`);
  return data?.id || null;
}
