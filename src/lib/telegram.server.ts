// Telegram Bot helpers (server-only).
// Token is loaded from env (TELEGRAM_BOT_TOKEN), with legacy fallback for safety.

export const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ?? "8884174946:AAHWBPkQDJLrp1XXgcP45vOZxlDA1IF5QLk";
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

/** Strip url to "host/path" (no scheme, no query), truncated. Used inside backticks
 *  so Telegram does NOT generate a link preview / image. */
export const cleanUrl = (raw?: string | null, max = 50): string => {
  if (!raw) return "—";
  let s = raw.trim();
  s = s.replace(/^https?:\/\//i, "").replace(/^\/\//, "");
  const q = s.indexOf("?");
  if (q !== -1) s = s.slice(0, q);
  const h = s.indexOf("#");
  if (h !== -1) s = s.slice(0, h);
  s = s.replace(/\/+$/, "");
  if (s.length > max) s = s.slice(0, max - 1) + "…";
  return s || "—";
};
