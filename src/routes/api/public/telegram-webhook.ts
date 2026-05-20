import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { tg, md, flag, cleanUrl } from "@/lib/telegram.server";

// -------------------- Auth --------------------
async function isAdmin(chatId: number): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("telegram_admins")
    .select("chat_id")
    .eq("chat_id", chatId)
    .maybeSingle();
  return !!data;
}

async function ensureFirstAdmin(chatId: number, username?: string, firstName?: string): Promise<boolean> {
  const { count } = await supabaseAdmin
    .from("telegram_admins")
    .select("chat_id", { count: "exact", head: true });
  if ((count ?? 0) === 0) {
    await supabaseAdmin.from("telegram_admins").insert({
      chat_id: chatId,
      username: username ?? null,
      first_name: firstName ?? null,
    });
    return true;
  }
  return false;
}

// -------------------- Renderers --------------------
const PAGE_SIZE = 5;

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "💳 Checkouts", callback_data: "checkouts:0" }],
      [{ text: "🌍 Rastreio", callback_data: "tracking:0" }],
      [{ text: "📊 Resumo", callback_data: "summary" }],
    ],
  };
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function maskCPF(c?: string | null) {
  if (!c) return "—";
  const d = c.replace(/\D/g, "");
  if (d.length !== 11) return c;
  return `${d.slice(0, 3)}.***.***-${d.slice(9)}`;
}
function statusEmoji(s: string) {
  return ({
    paid: "✅", pending: "⏳", draft: "📝", expired: "⌛", failed: "❌",
  } as Record<string, string>)[s] ?? "•";
}

async function renderCheckouts(page: number) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data: orders, count } = await supabaseAdmin
    .from("pix_orders")
    .select("id, slug, plan_key, amount_cents, status, customer_name, customer_email, customer_cpf, stripe_payment_intent_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const stripeExtras: Record<string, string> = {};
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && orders?.length) {
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });
      for (const o of orders) {
        if (!o.stripe_payment_intent_id) continue;
        try {
          const pi = await stripe.paymentIntents.retrieve(o.stripe_payment_intent_id);
          stripeExtras[o.id] = pi.status;
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
  }

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  let text = `*💳 Checkouts* — pág ${page + 1}/${totalPages} \\(total ${count ?? 0}\\)\n\n`;

  if (!orders?.length) {
    text += "_Nenhum pedido ainda\\._";
  } else {
    for (const o of orders) {
      const when = new Date(o.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
      text += `${statusEmoji(o.status)} *${md(formatBRL(o.amount_cents))}* — \`${md(o.status)}\`\n`;
      text += `👤 ${md(o.customer_name ?? "—")}\n`;
      text += `✉️ \`${md(o.customer_email ?? "—")}\`\n`;
      text += `🆔 CPF ${md(maskCPF(o.customer_cpf))}\n`;
      text += `📦 ${md(o.plan_key)} · \`#${md(o.slug ?? "—")}\`\n`;
      if (stripeExtras[o.id]) text += `💠 Stripe: \`${md(stripeExtras[o.id])}\`\n`;
      text += `🕒 ${md(when)}\n\n`;
    }
  }

  const nav: Array<Array<{ text: string; callback_data: string }>> = [];
  const row: Array<{ text: string; callback_data: string }> = [];
  if (page > 0) row.push({ text: "« Anterior", callback_data: `checkouts:${page - 1}` });
  if (page + 1 < totalPages) row.push({ text: "Próxima »", callback_data: `checkouts:${page + 1}` });
  if (row.length) nav.push(row);
  nav.push([{ text: "🔄 Atualizar", callback_data: `checkouts:${page}` }, { text: "🏠 Menu", callback_data: "menu" }]);

  return { text, reply_markup: { inline_keyboard: nav } };
}

async function renderTracking(page: number) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data: events, count } = await supabaseAdmin
    .from("visitor_events")
    .select("id, ip, country, country_code, city, device, browser, os, path, referrer, is_vpn, is_proxy, isp, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  let text = `*🌍 Rastreio* — pág ${page + 1}/${totalPages} \\(total ${count ?? 0}\\)\n\n`;

  if (!events?.length) {
    text += "_Nenhum visitante registrado ainda\\._";
  } else {
    for (const e of events) {
      const when = new Date(e.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
      const flags = [e.is_vpn ? "🛡VPN" : null, e.is_proxy ? "🕵Proxy" : null].filter(Boolean).join(" ");
      text += `${flag(e.country_code)} *${md(e.country ?? "Desconhecido")}* · ${md(e.city ?? "—")}\n`;
      text += `📡 \`${md(e.ip ?? "—")}\`${flags ? ` · ${md(flags)}` : ""}\n`;
      text += `📱 ${md(e.device ?? "—")} · ${md(e.browser ?? "—")} · ${md(e.os ?? "—")}\n`;
      text += `📄 \`${md(cleanUrl(e.path, 40))}\`\n`;
      if (e.referrer) text += `↩️ \`${md(cleanUrl(e.referrer, 50))}\`\n`;
      if (e.isp) text += `🏢 ${md(e.isp)}\n`;
      text += `🕒 ${md(when)}\n\n`;
    }
  }

  const nav: Array<Array<{ text: string; callback_data: string }>> = [];
  const row: Array<{ text: string; callback_data: string }> = [];
  if (page > 0) row.push({ text: "« Anterior", callback_data: `tracking:${page - 1}` });
  if (page + 1 < totalPages) row.push({ text: "Próxima »", callback_data: `tracking:${page + 1}` });
  if (row.length) nav.push(row);
  nav.push([{ text: "🔄 Atualizar", callback_data: `tracking:${page}` }, { text: "🏠 Menu", callback_data: "menu" }]);

  return { text, reply_markup: { inline_keyboard: nav } };
}

async function renderSummary() {
  const now = new Date();
  const day = new Date(now.getTime() - 24 * 3600e3).toISOString();
  const week = new Date(now.getTime() - 7 * 24 * 3600e3).toISOString();
  const month = new Date(now.getTime() - 30 * 24 * 3600e3).toISOString();

  const [d, w, m, pendC, paidC, paidSum] = await Promise.all([
    supabaseAdmin.from("visitor_events").select("id", { count: "exact", head: true }).gte("created_at", day),
    supabaseAdmin.from("visitor_events").select("id", { count: "exact", head: true }).gte("created_at", week),
    supabaseAdmin.from("visitor_events").select("id", { count: "exact", head: true }).gte("created_at", month),
    supabaseAdmin.from("pix_orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("pix_orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
    supabaseAdmin.from("pix_orders").select("amount_cents").eq("status", "paid"),
  ]);

  const revenue = (paidSum.data ?? []).reduce((acc, r) => acc + (r.amount_cents ?? 0), 0);

  const text =
    `*📊 Resumo HyroCode*\n\n` +
    `*Visitantes*\n` +
    `• Hoje: \`${d.count ?? 0}\`\n` +
    `• 7 dias: \`${w.count ?? 0}\`\n` +
    `• 30 dias: \`${m.count ?? 0}\`\n\n` +
    `*Pedidos*\n` +
    `• Pendentes: \`${pendC.count ?? 0}\`\n` +
    `• Pagos: \`${paidC.count ?? 0}\`\n` +
    `• Receita confirmada: *${md(formatBRL(revenue))}*\n`;

  return {
    text,
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔄 Atualizar", callback_data: "summary" }, { text: "🏠 Menu", callback_data: "menu" }],
      ],
    },
  };
}

function welcomeMessage(name?: string) {
  return {
    text:
      `*Olá${name ? `, ${md(name)}` : ""}\\!* 👋\n\n` +
      `Bem\\-vindo ao painel *HyroCode Bot*\\.\n` +
      `Escolha uma opção abaixo:`,
    reply_markup: mainMenu(),
  };
}

// Send helper that always disables link previews (no images, no embeds).
async function sendNoPreview(body: Record<string, unknown>) {
  return tg("sendMessage", {
    ...body,
    disable_web_page_preview: true,
    link_preview_options: { is_disabled: true },
  });
}
async function editNoPreview(body: Record<string, unknown>) {
  return tg("editMessageText", {
    ...body,
    disable_web_page_preview: true,
    link_preview_options: { is_disabled: true },
  });
}

// -------------------- Handler --------------------
export const Route = createFileRoute("/api/public/telegram-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let update: any;
        try { update = await request.json(); }
        catch { return new Response("Bad request", { status: 400 }); }

        try {
          if (update.message) {
            const msg = update.message;
            const chatId: number = msg.chat.id;
            const text: string = msg.text ?? "";
            const username: string | undefined = msg.from?.username;
            const firstName: string | undefined = msg.from?.first_name;

            const becameAdmin = await ensureFirstAdmin(chatId, username, firstName);
            const allowed = becameAdmin || (await isAdmin(chatId));
            if (!allowed) {
              await sendNoPreview({
                chat_id: chatId,
                text: "⛔ Acesso restrito. Este bot é privado.",
              });
              return new Response("ok");
            }

            if (text.startsWith("/start") || text === "/menu") {
              const w = welcomeMessage(firstName);
              await sendNoPreview({
                chat_id: chatId,
                text: w.text,
                parse_mode: "MarkdownV2",
                reply_markup: w.reply_markup,
              });
            } else {
              await sendNoPreview({
                chat_id: chatId,
                text: "Use /start para abrir o menu.",
              });
            }
            return new Response("ok");
          }

          if (update.callback_query) {
            const cq = update.callback_query;
            const chatId: number = cq.message.chat.id;
            const messageId: number = cq.message.message_id;
            const data: string = cq.data ?? "";
            const firstName: string | undefined = cq.from?.first_name;

            if (!(await isAdmin(chatId))) {
              await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "⛔ Acesso restrito" });
              return new Response("ok");
            }

            await tg("answerCallbackQuery", { callback_query_id: cq.id });

            let payload: { text: string; reply_markup: any } | null = null;

            if (data === "menu") {
              const w = welcomeMessage(firstName);
              payload = { text: w.text, reply_markup: w.reply_markup };
            } else if (data.startsWith("checkouts:")) {
              const page = parseInt(data.split(":")[1] || "0", 10);
              payload = await renderCheckouts(isNaN(page) ? 0 : page);
            } else if (data.startsWith("tracking:")) {
              const page = parseInt(data.split(":")[1] || "0", 10);
              payload = await renderTracking(isNaN(page) ? 0 : page);
            } else if (data === "summary") {
              payload = await renderSummary();
            }

            if (payload) {
              try {
                await editNoPreview({
                  chat_id: chatId,
                  message_id: messageId,
                  text: payload.text,
                  parse_mode: "MarkdownV2",
                  reply_markup: payload.reply_markup,
                });
              } catch {
                await sendNoPreview({
                  chat_id: chatId,
                  text: payload.text,
                  parse_mode: "MarkdownV2",
                  reply_markup: payload.reply_markup,
                });
              }
            }
            return new Response("ok");
          }
        } catch (err) {
          console.error("telegram-webhook error", err);
        }

        return new Response("ok");
      },
    },
  },
});
