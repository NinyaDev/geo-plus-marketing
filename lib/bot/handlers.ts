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
}): TelegramUserMeta {
  return {
    userId: ctx.from!.id,
    chatId: ctx.chat!.id,
    username: ctx.from!.username,
    firstName: ctx.from!.first_name,
    lastName: ctx.from!.last_name,
    languageCode: ctx.from!.language_code,
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
    await ctx.reply(
      `Welcome to GEOPlusMarketing, ${user.firstName}! 🚀\n\n` +
        `I'm your autonomous marketing agent powered by AI. Here's what I can do:\n\n` +
        `📊 /status — Agent status & loaded tools\n` +
        `❓ /help — Show available commands\n\n` +
        `Get started by telling me about your business!\n` +
        `Example: "I'm a plumber in Miami, FL"`
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      `GEOPlusMarketing Agent — Commands & Capabilities\n\n` +
        `Commands:\n` +
        `/start — Welcome message\n` +
        `/help — This help message\n` +
        `/status — Agent status & loaded tools\n\n` +
        `What I can do (just ask in natural language):\n\n` +
        `📋 Business Setup\n` +
        `• Register your business profile\n` +
        `• Manage business details\n\n` +
        `✍️ Content Creation\n` +
        `• Generate geo-targeted blog posts\n` +
        `• Create social media posts (GBP, Instagram, Facebook)\n` +
        `• Draft review responses\n` +
        `• Generate landing pages\n\n` +
        `🎯 Lead Generation\n` +
        `• Track and manage leads\n` +
        `• Prospect new clients in your area\n` +
        `• Generate lead reports\n\n` +
        `🔍 GEO Optimization\n` +
        `• Run AI visibility audits\n` +
        `• Build citation plans\n` +
        `• Generate schema markup (JSON-LD)\n\n` +
        `🎨 Image Generation\n` +
        `• Create CTA advertising visuals\n` +
        `• Design social media graphics\n\n` +
        `📈 Campaigns & Reports\n` +
        `• Create full marketing campaigns\n` +
        `• Generate status reports\n` +
        `• Deep business research`
    );
  });

  bot.command("status", async (ctx) => {
    const status = getStatus();
    await ctx.reply(
      `GEOPlusMarketing Agent Status\n\n` +
        `Tools loaded: ${status.skills.length}\n` +
        `• ${status.skills.join("\n• ")}\n\n` +
        `Uptime: ${Math.floor(status.uptime)}s`
    );
  });

  bot.on("text", async (ctx) => {
    const user = extractUserMeta(ctx);
    const userId = String(user.userId);

    // Rate limiting
    const rateCheck = checkRateLimit(userId);
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
