import { NextRequest, NextResponse } from "next/server";
import { getBot } from "@/lib/bot/instance";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Dedup: track recently processed update IDs to prevent Telegram retries
const processedUpdates = new Set<number>();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const config = getConfig();
    const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");

    if (secretHeader !== config.telegram.webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updateId: number | undefined = body.update_id;

    // Skip duplicate updates (Telegram retries on timeout)
    if (updateId && processedUpdates.has(updateId)) {
      return NextResponse.json({ ok: true });
    }
    if (updateId) {
      processedUpdates.add(updateId);
      // Keep set bounded
      if (processedUpdates.size > 500) {
        const oldest = [...processedUpdates].slice(0, 250);
        oldest.forEach((id) => processedUpdates.delete(id));
      }
    }

    const bot = getBot();
    await bot.handleUpdate(body);
  } catch (error) {
    console.error("Telegram webhook error:", error);
  }

  // Always return 200 to prevent Telegram from retrying
  return NextResponse.json({ ok: true });
}
