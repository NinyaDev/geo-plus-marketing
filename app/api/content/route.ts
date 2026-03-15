import { NextResponse } from "next/server";
import { getContent } from "@/lib/data/content";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const content = await getContent({ type, status: status || "published" });
  return NextResponse.json({ content });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // Demo data — just acknowledge
  if (id.startsWith("content_") || !isSupabaseConfigured()) {
    return NextResponse.json({ success: true });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("content").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { error: "id and status are required" },
      { status: 400 }
    );
  }

  // Handle demo data IDs (content_001, etc.) — not in Supabase
  if (id.startsWith("content_") || !isSupabaseConfigured()) {
    return NextResponse.json({
      content: {
        id,
        status,
        slug: generateSlug(id),
        published_at: status === "published" ? new Date().toISOString() : null,
      },
    });
  }

  const supabase = getSupabaseAdmin();

  // If publishing, fetch existing to generate slug if needed
  const updates: Record<string, unknown> = { status };

  if (status === "published") {
    const { data: existing } = await supabase
      .from("content")
      .select("title, slug")
      .eq("id", id)
      .single();

    if (existing && !existing.slug) {
      updates.slug = generateSlug(existing.title);
    }
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("content")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data });
}
