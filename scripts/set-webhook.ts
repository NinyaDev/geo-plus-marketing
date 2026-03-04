async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const baseUrl = process.env.TELEGRAM_WEBHOOK_URL;

  if (!token || !secret || !baseUrl) {
    console.error(
      "Missing required env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, TELEGRAM_WEBHOOK_URL"
    );
    process.exit(1);
  }

  const webhookUrl = `${baseUrl}/api/telegram`;
  const apiUrl = `https://api.telegram.org/bot${token}/setWebhook`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message"],
    }),
  });

  const data = await res.json();

  if (data.ok) {
    console.log(`Webhook set successfully: ${webhookUrl}`);
  } else {
    console.error("Failed to set webhook:", data);
    process.exit(1);
  }
}

main();
