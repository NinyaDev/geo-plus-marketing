import { NextRequest, NextResponse } from "next/server";
import { getBot } from "@/lib/bot/instance";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const config = getConfig();
    const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");

    if (secretHeader !== config.telegram.webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const bot = getBot();
    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
