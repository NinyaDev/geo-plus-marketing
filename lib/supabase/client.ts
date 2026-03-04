import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getConfig } from "../config";

let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!anonClient) {
    const config = getConfig();
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error("Supabase URL and anon key are required");
    }
    anonClient = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return anonClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!serviceClient) {
    const config = getConfig();
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error("Supabase URL and service role key are required");
    }
    serviceClient = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey
    );
  }
  return serviceClient;
}

export function isSupabaseConfigured(): boolean {
  const config = getConfig();
  return !!(config.supabase.url && config.supabase.anonKey);
}
