import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { isGhlConfigured, syncContactToGhl, addNoteToContact } from "@/lib/ghl/client";
import { getOrCreateBusinessId } from "./helpers";

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
    // Resolve business ID
    const businessId =
      params.businessId ||
      (await getOrCreateBusinessId(params.telegramUserId));

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        message: `Lead ${params.name || "unnamed"} tracked (in-memory — Supabase not configured).`,
      };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        business_id: businessId,
        source: params.source,
        name: params.name,
        email: params.email,
        phone: params.phone,
        service_requested: params.serviceRequested,
        city: params.city,
        notes: params.notes,
        quality_score: params.qualityScore,
        status: "lead",
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

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
        phone: params.phone,
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
    };
  },
});
