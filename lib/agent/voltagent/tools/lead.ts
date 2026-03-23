import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { isGhlConfigured, syncContactToGhl, addNoteToContact } from "@/lib/ghl/client";
import { getOrCreateBusinessId } from "./helpers";

/** Normalize a phone string to digits only, validate length. */
function normalizePhone(raw?: string): { phone?: string; warning?: string } {
  if (!raw) return {};
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return { warning: "Phone number contains no digits." };
  if (digits.length < 7) return { warning: `Phone "${raw}" seems too short (${digits.length} digits).` };
  if (digits.length > 15) return { warning: `Phone "${raw}" seems too long (${digits.length} digits).` };
  // Format as 10-digit US if exactly 10 or 11 starting with 1
  if (digits.length === 11 && digits.startsWith("1")) {
    return { phone: digits.slice(1) };
  }
  return { phone: digits };
}

/** Simple email format check (the LLM may pass invalid strings). */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const addLeadTool = tool({
  description:
    "Add a new lead — a business or person who has shown interest in buying GEO services from the franchisee. Saves to database and syncs to GoHighLevel CRM. Use ONLY for interested parties, NOT for prospects from research.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    source: z
      .enum(["manual", "landing_page", "prospector", "gpt_researcher"])
      .default("manual")
      .describe("How the lead was acquired"),
    name: z.string().optional().describe("Lead contact name"),
    email: z.string().optional().describe("Lead email"),
    phone: z.string().optional().describe("Lead phone number"),
    serviceRequested: z.string().optional().describe("What service the lead needs"),
    city: z.string().optional().describe("Lead location"),
    notes: z.string().optional().describe("Additional notes about the lead"),
    qualityScore: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .describe("Lead quality score 1-10"),
  }),
  execute: async (params) => {
    const warnings: string[] = [];

    // --- Validation ---

    // Email format check
    if (params.email && !isValidEmail(params.email)) {
      return {
        success: false,
        error: `"${params.email}" doesn't look like a valid email address. Please double-check and try again.`,
      };
    }

    // Phone normalization
    const { phone: normalizedPhone, warning: phoneWarning } = normalizePhone(params.phone);
    if (phoneWarning) warnings.push(phoneWarning);

    // Resolve business ID
    const businessId =
      params.businessId ||
      (await getOrCreateBusinessId(params.telegramUserId));

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        message: `Lead ${params.name || "unnamed"} tracked (in-memory — Supabase not configured).`,
        warnings: warnings.length ? warnings : undefined,
      };
    }

    const supabase = getSupabaseAdmin();

    // Duplicate detection by email
    if (params.email) {
      const { data: existing } = await supabase
        .from("leads")
        .select("id, name, status, created_at")
        .eq("email", params.email)
        .limit(1);

      if (existing && existing.length > 0) {
        const dup = existing[0];
        return {
          success: false,
          error: `A lead with email "${params.email}" already exists: ${dup.name || "unnamed"} (status: ${dup.status}, added ${new Date(dup.created_at).toLocaleDateString()}). Update the existing lead instead of creating a duplicate.`,
          existingLeadId: dup.id,
        };
      }
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        business_id: businessId,
        source: params.source,
        name: params.name,
        email: params.email,
        phone: normalizedPhone || params.phone,
        service_requested: params.serviceRequested,
        city: params.city,
        notes: params.notes,
        quality_score: params.qualityScore,
        status: "lead",
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation as a duplicate
      if (error.code === "23505" || error.message.includes("duplicate")) {
        return {
          success: false,
          error: `A lead with this information already exists. Check your leads list.`,
        };
      }
      return { success: false, error: error.message };
    }

    // Sync to GoHighLevel CRM
    let ghlContactId: string | undefined;
    if (isGhlConfigured() && params.email) {
      const nameParts = (params.name || "").split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.slice(1).join(" ") || undefined;

      const ghlResult = await syncContactToGhl({
        firstName,
        lastName,
        email: params.email,
        phone: normalizedPhone || params.phone,
        source: "GEOPlusMarketing Bot",
        tags: ["geoplus-lead", "bot-added", params.source],
      });

      if (ghlResult.success && ghlResult.contactId) {
        ghlContactId = ghlResult.contactId;

        // Add context note
        const noteLines = [
          `Lead added via bot (source: ${params.source})`,
          params.serviceRequested ? `Service requested: ${params.serviceRequested}` : null,
          params.city ? `City: ${params.city}` : null,
          params.notes ? `Notes: ${params.notes}` : null,
          params.qualityScore ? `Quality score: ${params.qualityScore}/10` : null,
        ].filter(Boolean).join("\n");

        await addNoteToContact(ghlResult.contactId, noteLines);
      }
    }

    return {
      success: true,
      lead: data,
      ghlContactId,
      ghlSynced: !!ghlContactId,
      warnings: warnings.length ? warnings : undefined,
    };
  },
});
