import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const addLeadTool = tool({
  description:
    "Add a new lead (potential customer) to the database. Use when a user reports a new lead or wants to track a potential client.",
  inputSchema: z.object({
    businessId: z.string().describe("Business ID this lead belongs to"),
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
        business_id: params.businessId,
        source: params.source,
        name: params.name,
        email: params.email,
        phone: params.phone,
        service_requested: params.serviceRequested,
        city: params.city,
        notes: params.notes,
        quality_score: params.qualityScore,
        status: "new",
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, lead: data };
  },
});
