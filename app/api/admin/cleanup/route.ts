import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";

const TABLES = ["analytics", "content", "campaigns", "leads", "conversations", "businesses"] as const;

/** DELETE /api/admin/cleanup — Wipe all data from Supabase tables for a fresh production start. */
export async function DELETE(request: Request) {
  try {
    const { confirm } = await request.json();

    if (confirm !== "DELETE_ALL_DATA") {
      return NextResponse.json(
        { error: 'Send { "confirm": "DELETE_ALL_DATA" } to proceed' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();
    const results: Record<string, { deleted: number } | { error: string }> = {};

    for (const table of TABLES) {
      // Count first
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      // Delete all rows
      const { error } = await supabase
        .from(table)
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // neq trick to delete all rows

      if (error) {
        results[table] = { error: error.message };
      } else {
        results[table] = { deleted: count ?? 0 };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, results });
  } catch (e) {
    console.error("[Cleanup] Error:", e);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
