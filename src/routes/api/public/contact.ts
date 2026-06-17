import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { tg, md } from "@/lib/telegram.server";

const ContactSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  estado: z.string().trim().min(2).max(2),
  whatsapp: z.string().trim().min(8).max(30),
  descricao: z.string().trim().max(2000).optional().default(""),
});

const TO_EMAIL = "hyrocodecontato@gmail.com";

async function trySendResendEmail(payload: z.infer<typeof ContactSchema>) {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) return { sent: false, reason: "resend_not_configured" };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 12px;font-size:20px">Novo contato HyroCode</h2>
      <p style="margin:0 0 18px;color:#475569">Você recebeu uma nova solicitação pelo formulário do site.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#64748b;width:140px">Nome</td><td style="padding:8px 0"><b>${escapeHtml(payload.nome)}</b></td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0">${escapeHtml(payload.email)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Estado</td><td style="padding:8px 0">${escapeHtml(payload.estado)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">WhatsApp</td><td style="padding:8px 0">${escapeHtml(payload.whatsapp)}</td></tr>
        ${payload.descricao ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Descrição</td><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(payload.descricao)}</td></tr>` : ""}
      </table>
    </div>
  `;

  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: "HyroCode <onboarding@resend.dev>",
      to: [TO_EMAIL],
      reply_to: payload.email,
      subject: `Novo contato — ${payload.nome}`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { sent: false, reason: `resend_error_${res.status}`, body };
  }
  return { sent: true };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function notifyTelegram(payload: z.infer<typeof ContactSchema>) {
  const { data: admins } = await supabaseAdmin
    .from("telegram_admins")
    .select("chat_id");
  if (!admins?.length) return { sent: 0, reason: "no_admins" };

  const digits = payload.whatsapp.replace(/\D/g, "");
  const wa = digits.length >= 10
    ? `https://wa.me/${digits.startsWith("55") ? digits : "55" + digits}`
    : null;
  const when = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  const text =
    `*📨 Nova solicitação \\(Valor a consultar\\)*\n\n` +
    `👤 *${md(payload.nome)}*\n` +
    `✉️ \`${md(payload.email)}\`\n` +
    `📱 \`${md(payload.whatsapp)}\`\n` +
    `📍 ${md(payload.estado)}\n` +
    (payload.descricao ? `\n📝 ${md(payload.descricao)}\n` : "") +
    `\n🕒 ${md(when)}`;

  const reply_markup = wa
    ? { inline_keyboard: [[{ text: "💬 Abrir WhatsApp", url: wa }]] }
    : undefined;

  let sent = 0;
  for (const a of admins) {
    try {
      await tg("sendMessage", {
        chat_id: a.chat_id,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
        link_preview_options: { is_disabled: true },
        reply_markup,
      });
      sent++;
    } catch (e) {
      console.error("telegram notify failed for", a.chat_id, e);
    }
  }
  return { sent };
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return jsonError("Invalid JSON", 400);
        }

        const parsed = ContactSchema.safeParse(raw);
        if (!parsed.success) {
          return jsonError("Dados inválidos", 400, parsed.error.flatten());
        }
        const data = parsed.data;

        // 1) Persist to database (always)
        const { error: dbError } = await supabaseAdmin
          .from("contact_submissions")
          .insert({
            nome: data.nome,
            email: data.email,
            estado: data.estado,
            whatsapp: data.whatsapp,
            descricao: data.descricao || null,
          });
        if (dbError) {
          console.error("contact_submissions insert error", dbError);
          return jsonError("Não foi possível registrar sua solicitação. Tente novamente.", 500);
        }

        // 2) Notify Telegram admins (non-blocking)
        notifyTelegram(data).catch((e) => console.error("notifyTelegram error", e));

        // 3) Try to send email (no-op if Resend isn't configured)
        const emailResult = await trySendResendEmail(data).catch((e) => {
          console.error("send email error", e);
          return { sent: false, reason: "exception" as const };
        });

        return Response.json({ ok: true, emailed: emailResult.sent });
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
    },
  },
});

function jsonError(message: string, status: number, details?: unknown) {
  return new Response(JSON.stringify({ ok: false, error: message, details }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
