import { createFileRoute } from "@tanstack/react-router";
import { tg } from "@/lib/telegram.server";

// One-shot helper to (re)register the Telegram webhook for the current bot token.
// Protected by ADMIN_TOKEN query string. Safe to call multiple times.
export const Route = createFileRoute("/api/public/telegram-setup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const expected = process.env.ADMIN_TOKEN;
        if (!expected || token !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const origin = url.origin;
        const webhookUrl = `${origin}/api/public/telegram-webhook`;

        try {
          await tg("deleteWebhook", { drop_pending_updates: false });
          const set = await tg("setWebhook", {
            url: webhookUrl,
            allowed_updates: ["message", "callback_query"],
          });
          const info = await tg("getWebhookInfo", {});
          return Response.json({ ok: true, set, info, webhookUrl });
        } catch (e: any) {
          return Response.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
        }
      },
    },
  },
});
