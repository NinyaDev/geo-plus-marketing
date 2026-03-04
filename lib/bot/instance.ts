import { Telegraf } from "telegraf";
import { getConfig } from "../config";

let bot: Telegraf | null = null;

export function getBot(): Telegraf {
  if (!bot) {
    const config = getConfig();
    bot = new Telegraf(config.telegram.botToken, {
      telegram: { webhookReply: false },
    });
    registerHandlers(bot);
  }
  return bot;
}

async function registerHandlers(bot: Telegraf): Promise<void> {
  const { registerBotHandlers } = await import("./handlers");
  registerBotHandlers(bot);
}
