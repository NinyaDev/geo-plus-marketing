import { isSupabaseConfigured } from "../supabase/client";
import { demoContent, type ContentPiece } from "./demo-data";

/** Merge metadata.excerpt / metadata.author / metadata.tags into top-level fields */
function normalizeContent(row: Record<string, unknown>): ContentPiece {
  const meta = (row.metadata as Record<string, unknown>) || {};
  return {
    ...row,
    excerpt: (row.excerpt as string) || (meta.excerpt as string) || "",
    author: (row.author as string) || (meta.author as string) || "GEOPlusMarketing",
    tags: (row.tags as string[]) || (meta.tags as string[]) || [],
  } as ContentPiece;
}

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
      if (data?.length) return data.map(normalizeContent);
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
      if (data) return normalizeContent(data);
    } catch {
      // fall through
    }
  }
  return demoContent.find((c) => c.slug === slug) ?? null;
}
