import { Telegraf } from "telegraf";
import type { TelegramUserMeta } from "./types";
import { handleMessage, getStatus } from "../agent/core";
import type { AgentMessage } from "../agent/types";
import { checkRateLimit } from "../agent/voltagent/guards";

const TELEGRAM_MAX_LENGTH = 4096;

function extractUserMeta(ctx: {
  from?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  chat?: { id: number };
}): TelegramUserMeta | null {
  if (!ctx.from || !ctx.chat) {
    console.error("[Telegram] Missing from or chat in context");
    return null;
  }
  return {
    userId: ctx.from.id,
    chatId: ctx.chat.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
    languageCode: ctx.from.language_code,
  };
}

/** Split long messages at natural boundaries */
function chunkMessage(text: string): string[] {
  if (text.length <= TELEGRAM_MAX_LENGTH) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= TELEGRAM_MAX_LENGTH) {
      chunks.push(remaining);
      break;
    }

    // Try to split at paragraph, then sentence, then word boundary
    let splitIdx = remaining.lastIndexOf("\n\n", TELEGRAM_MAX_LENGTH);
    if (splitIdx < TELEGRAM_MAX_LENGTH / 2) {
      splitIdx = remaining.lastIndexOf("\n", TELEGRAM_MAX_LENGTH);
    }
    if (splitIdx < TELEGRAM_MAX_LENGTH / 2) {
      splitIdx = remaining.lastIndexOf(" ", TELEGRAM_MAX_LENGTH);
    }
    if (splitIdx < TELEGRAM_MAX_LENGTH / 2) {
      splitIdx = TELEGRAM_MAX_LENGTH;
    }

    chunks.push(remaining.substring(0, splitIdx));
    remaining = remaining.substring(splitIdx).trimStart();
  }

  return chunks;
}

export function registerBotHandlers(bot: Telegraf): void {
  bot.command("start", async (ctx) => {
    const user = extractUserMeta(ctx);
    if (!user) return;
    await ctx.reply(
      `Welcome to GEOPlusMarketing, ${user.firstName}!\n\n` +
        `I'm your AI sales assistant. I help you find prospects, manage leads, and create content to sell GEO services.\n\n` +
        `Just tell me what you need:\n` +
        `- "Find plumbers in Lehi that need GEO"\n` +
        `- "Add a lead: John Smith, john@test.com, interested in GEO"\n` +
        `- "Show my leads"\n` +
        `- "Generate a blog post about AI visibility for dentists in SLC"\n\n` +
        `/help — Show all commands\n` +
        `/status — Agent status`
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      `GEOPlusMarketing Agent — Commands & Capabilities\n\n` +
        `Commands:\n` +
        `/start — Welcome message\n` +
        `/help — This help message\n` +
        `/status — Agent status\n\n` +
        `Just ask me in natural language:\n\n` +
        `Lead Management (Core)\n` +
        `- "Add a lead: John Smith, john@test.com, wants GEO"\n` +
        `- "Show my leads" / "Show leads by status"\n` +
        `- Leads auto-sync to GoHighLevel CRM\n\n` +
        `Prospecting\n` +
        `- "Find dentists in Provo that need GEO"\n` +
        `- Prospects are outreach targets — not leads until they show interest\n\n` +
        `Content Creation\n` +
        `- "Write a blog post about AI visibility for plumbers in SLC"\n` +
        `- "Create an Instagram post for my GEO services"\n` +
        `- "List my drafts" / "Publish my latest draft"\n\n` +
        `Research & Reports\n` +
        `- "Give me a status report"\n` +
        `- "Research the HVAC market in Salt Lake City"`
    );
  });

  bot.command("status", async (ctx) => {
    const status = getStatus();
    await ctx.reply(
      `GEOPlusMarketing Agent Status\n\n` +
        `Tools loaded: ${status.tools}\n` +
        `Uptime: ${Math.floor(status.uptime)}s`
    );
  });

  bot.on("text", async (ctx) => {
    const user = extractUserMeta(ctx);
    if (!user) return;
    const userId = String(user.userId);

    // Rate limiting
    const rateCheck = await checkRateLimit(userId);
    if (!rateCheck.allowed) {
      await ctx.reply(
        `You've reached the rate limit (${rateCheck.resetIn}s until reset). Please wait a moment.`
      );
      return;
    }

    // Send typing indicator
    await ctx.sendChatAction("typing");

    // Keep typing indicator alive for long operations
    const typingInterval = setInterval(() => {
      ctx.sendChatAction("typing").catch(() => {});
    }, 4000);

    try {
      const agentMessage: AgentMessage = {
        text: ctx.message.text,
        userId,
        channel: "telegram",
        timestamp: Date.now(),
        metadata: { chatId: user.chatId, username: user.username },
      };

      const response = await handleMessage(agentMessage);
      const chunks = chunkMessage(response.text);

      for (const chunk of chunks) {
        try {
          await ctx.reply(chunk, { parse_mode: "Markdown" });
        } catch {
          // If Markdown parsing fails, send as plain text
          await ctx.reply(chunk);
        }
      }
    } catch (error) {
      console.error("Handler error:", error);
      await ctx.reply(
        "Sorry, I encountered an error processing your message. Please try again."
      );
    } finally {
      clearInterval(typingInterval);
    }
  });
}
