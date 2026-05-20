import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";
import QRCode from "qrcode";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const PLANS = {
  "landing-premium": {
    key: "landing-premium",
    label: "Landing Page - HyroCode",
    description: "Landing page premium, design exclusivo, totalmente personalizada.",
    amount_cents: 49700,
    bullets: [
      "Logotipo feito do zero",
      "Design exclusivo e responsivo",
      "SEO básico configurado",
      "Configuração de domínio",
      "2 rodadas de alterações",
      "Garantia de desempenho",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (slice: string, factor: number) => {
    let sum = 0;
    for (const ch of slice) sum += Number(ch) * factor--;
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return (
    calc(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calc(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

const SlugSchema = z.string().regex(/^[A-Za-z0-9]{5,10}$/, "Identificador inválido");

// 1. Criar pedido em rascunho (chamado quando clica no plano)
const StartSchema = z.object({
  planKey: z.enum(Object.keys(PLANS) as [PlanKey, ...PlanKey[]]),
});

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => StartSchema.parse(input))
  .handler(async ({ data }) => {
    const plan = PLANS[data.planKey];
    const { data: row, error } = await supabaseAdmin
      .from("pix_orders")
      .insert({
        plan_key: plan.key,
        amount_cents: plan.amount_cents,
        currency: "brl",
        status: "draft",
        customer_name: null,
        customer_email: null,
        customer_cpf: null,
      })
      .select("slug")
      .single();
    if (error || !row?.slug) {
      console.error("startCheckout insert error", error);
      throw new Error("Não foi possível iniciar o checkout.");
    }
    return { slug: row.slug as string };
  });

// 2. Ler dados de exibição do pedido (capa do checkout)
const GetSchema = z.object({ slug: SlugSchema });

export const getCheckoutOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GetSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("pix_orders")
      .select("id, slug, plan_key, amount_cents, status, pix_qr_data, pix_qr_image_url, expires_at, customer_email")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) throw new Error("Pedido não encontrado.");
    const plan = PLANS[row.plan_key as PlanKey];
    if (!plan) throw new Error("Plano inválido.");
    return {
      slug: row.slug as string,
      status: row.status as "draft" | "pending" | "paid" | "expired" | "failed",
      plan: {
        key: plan.key,
        label: plan.label,
        description: plan.description,
        amount_cents: plan.amount_cents,
        bullets: [...plan.bullets],
      },
      qrImage: row.pix_qr_image_url,
      qrCopyPaste: row.pix_qr_data,
      expiresAt: row.expires_at,
    };
  });

// 3. Gerar Pix (após preencher formulário)
const GeneratePixSchema = z.object({
  slug: SlugSchema,
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  cpf: z.string().trim().min(11).max(14).refine(isValidCPF, "CPF inválido"),
});

export const generatePix = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GeneratePixSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("pix_orders")
      .select("id, slug, plan_key, amount_cents, status, pix_qr_data, pix_qr_image_url, expires_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (fetchErr || !existing) throw new Error("Pedido não encontrado.");

    if (existing.status === "pending" && existing.pix_qr_data && existing.pix_qr_image_url) {
      return {
        qrImage: existing.pix_qr_image_url,
        qrCopyPaste: existing.pix_qr_data,
        expiresAt: existing.expires_at,
      };
    }

    const plan = PLANS[existing.plan_key as PlanKey];
    if (!plan) throw new Error("Plano inválido.");

    const stripe = getStripe();
    const cpfDigits = data.cpf.replace(/\D/g, "");

    const pi = await stripe.paymentIntents.create({
      amount: plan.amount_cents,
      currency: "brl",
      payment_method_types: ["pix"],
      description: `${plan.label}`,
      receipt_email: data.email,
      metadata: {
        order_id: existing.id,
        order_slug: existing.slug,
        plan_key: plan.key,
        customer_name: data.name,
        customer_cpf: cpfDigits,
      },
      payment_method_data: {
        type: "pix",
        billing_details: { name: data.name, email: data.email },
      },
      confirm: true,
    });

    const next = pi.next_action;
    const pix = next?.type === "pix_display_qr_code" ? next.pix_display_qr_code : null;
    if (!pix?.data) throw new Error("Não foi possível gerar o Pix. Verifique se o Pix está ativado na sua conta Stripe.");

    const qrImage = await QRCode.toDataURL(pix.data, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 360,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    });
    const expiresAt = pix.expires_at ? new Date(pix.expires_at * 1000).toISOString() : null;

    const { error: updErr } = await supabaseAdmin
      .from("pix_orders")
      .update({
        customer_name: data.name,
        customer_email: data.email,
        customer_cpf: cpfDigits,
        status: "pending",
        stripe_payment_intent_id: pi.id,
        pix_qr_data: pix.data,
        pix_qr_image_url: qrImage,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (updErr) {
      console.error("generatePix update error", updErr);
      throw new Error("Não foi possível registrar o Pix.");
    }

    return { qrImage, qrCopyPaste: pix.data, expiresAt };
  });

// 4. Polling de status
export const getOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GetSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("pix_orders")
      .select("status, expires_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) throw new Error("Pedido não encontrado.");
    return {
      status: row.status as "draft" | "pending" | "paid" | "expired" | "failed",
      expiresAt: row.expires_at,
    };
  });
