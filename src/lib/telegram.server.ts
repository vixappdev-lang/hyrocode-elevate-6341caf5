// Telegram Bot helpers (server-only).
// Token is intentionally kept in code per user request.

export const TELEGRAM_BOT_TOKEN = "8884174946:AAHWBPkQDJLrp1XXgcP45vOZxlDA1IF5QLk";
export const TELEGRAM_WEBHOOK_SECRET = "hyrocode-bot-2026-secret";
const BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

type TgMethod =
  | "sendMessage" | "editMessageText" | "answerCallbackQuery"
  | "setWebhook" | "deleteWebhook" | "getWebhookInfo";

export async function tg<T = unknown>(method: TgMethod, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!json.ok) {
    console.error(`Telegram ${method} failed:`, json.description);
    throw new Error(json.description ?? `Telegram ${method} failed`);
  }
  return json.result;
}

export const md = (s: string) =>
  String(s ?? "").replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

export const flag = (code?: string | null) => {
  if (!code || code.length !== 2) return "🌐";
  const A = 0x1f1e6;
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => A + c.charCodeAt(0) - 65));
};
