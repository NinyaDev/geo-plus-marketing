import { isSupabaseConfigured } from "../supabase/client";
import { demoContent, type ContentPiece } from "./demo-data";

export async function getContent(options?: {
  type?: string;
  status?: string;
}): Promise<ContentPiece[]> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      let query = supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });
      if (options?.type) query = query.eq("type", options.type);
      if (options?.status) query = query.eq("status", options.status);
      const { data } = await query;
      if (data?.length) return data as ContentPiece[];
    } catch {
      // fall through to demo data
    }
  }
  let results = demoContent;
  if (options?.type) results = results.filter((c) => c.type === options.type);
  if (options?.status)
    results = results.filter((c) => c.status === options.status);
  return results;
}

export async function getContentBySlug(
  slug: string
): Promise<ContentPiece | null> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("../supabase/client");
      const supabase = getSupabase();
      const { data } = await supabase
        .from("content")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) return data as ContentPiece;
    } catch {
      // fall through
    }
  }
  return demoContent.find((c) => c.slug === slug) ?? null;
}
