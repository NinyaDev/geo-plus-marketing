import { NextRequest, NextResponse } from "next/server";
import { getBot } from "@/lib/bot/instance";
import { getConfig } from "@/lib/config";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// In-memory dedup for fast path (catches retries within same container)
const processedUpdates = new Set<number>();

/** Check if this update was already processed, using Supabase + in-memory. */
async function isDuplicate(updateId: number): Promise<boolean> {
  // Fast path: in-memory check
  if (processedUpdates.has(updateId)) return true;

  // Slow path: check Supabase for cross-container dedup
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .eq("channel", "telegram_dedup")
        .eq("user_id", String(updateId))
        .limit(1);

      if (data && data.length > 0) return true;
    } catch {
      // If Supabase check fails, rely on in-memory only — better to risk a dupe than drop a message
    }
  }

  return false;
}

/** Mark an update as processed in both in-memory and Supabase. */
async function markProcessed(updateId: number): Promise<void> {
  processedUpdates.add(updateId);

  // Keep in-memory set bounded
  if (processedUpdates.size > 500) {
    const oldest = [...processedUpdates].slice(0, 250);
    oldest.forEach((id) => processedUpdates.delete(id));
  }

  // Persist to Supabase for cross-container dedup
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("conversations").insert({
        user_id: String(updateId),
        channel: "telegram_dedup",
        messages: [],
      });
    } catch {
      // Non-critical — in-memory dedup still works for this container
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const config = getConfig();
    const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");

    if (secretHeader !== config.telegram.webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updateId: number | undefined = body.update_id;

    // Dedup: skip if already processed (in-memory + Supabase)
    if (updateId) {
      if (await isDuplicate(updateId)) {
        return NextResponse.json({ ok: true });
      }
      await markProcessed(updateId);
    }

    const bot = getBot();
    await bot.handleUpdate(body);
  } catch (error) {
    console.error("Telegram webhook error:", error);
  }

  // Always return 200 to prevent Telegram from retrying
  return NextResponse.json({ ok: true });
}
