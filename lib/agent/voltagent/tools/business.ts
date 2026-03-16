import { tool } from "ai";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";

export const registerBusinessTool = tool({
  description:
    "Register the franchisee's own business operation (their GEO sales business). Usually done once. Always confirm with the user before calling this tool.",
  inputSchema: z.object({
    name: z.string().describe("Business name"),
    serviceType: z
      .string()
      .describe("Type of service (plumber, dentist, HVAC, etc.)"),
    city: z.string().describe("Primary city of operation"),
    state: z.string().optional().describe("State abbreviation"),
    zipCode: z.string().optional().describe("ZIP code"),
    phone: z.string().optional().describe("Business phone number"),
    website: z.string().optional().describe("Business website URL"),
    googleBusinessUrl: z
      .string()
      .optional()
      .describe("Google Business Profile URL"),
    description: z.string().optional().describe("Brief business description"),
    telegramUserId: z.string().describe("Telegram user ID of the franchisee managing this client"),
  }),
  execute: async (params) => {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        message: `Business "${params.name}" registered (in-memory — Supabase not configured).`,
        business: {
          id: `local-${Date.now()}`,
          name: params.name,
          service_type: params.serviceType,
          city: params.city,
          state: params.state,
        },
      };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        telegram_user_id: params.telegramUserId,
        name: params.name,
        service_type: params.serviceType,
        city: params.city,
        state: params.state,
        zip_code: params.zipCode,
        phone: params.phone,
        website: params.website,
        google_business_url: params.googleBusinessUrl,
        description: params.description,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: `Business "${data.name}" registered successfully!`,
      business: data,
    };
  },
});

export const getBusinessTool = tool({
  description:
    "Get the franchisee's registered business. Use to find the businessId needed for other tools (adding leads, generating content, etc.).",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID"),
    businessId: z.string().optional().describe("Specific business ID to fetch"),
  }),
  execute: async (params) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase not configured" };
    }

    const supabase = getSupabaseAdmin();

    if (params.businessId) {
      const { data, error } = await supabase
        .from("businesses")
        .select()
        .eq("id", params.businessId)
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, business: data };
    }

    const { data, error } = await supabase
      .from("businesses")
      .select()
      .eq("telegram_user_id", params.telegramUserId)
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return {
      success: true,
      businesses: data,
      count: data.length,
    };
  },
});
