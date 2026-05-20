import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";
import QRCode from "qrcode";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Server-side source of truth for plan pricing (cents).
const PLANS = {
  "landing-premium": {
    key: "landing-premium",
    label: "Landing Page Premium",
    amount_cents: 49700,
  },
} as const satisfies Record<string, { key: string; label: string; amount_cents: number }>;

export type PlanKey = keyof typeof PLANS;

function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (slice: string, factor: number) => {
    let sum = 0;
    for (const ch of slice) {
      sum += Number(ch) * factor--;
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(cpf.slice(0, 9), 10);
  if (d1 !== Number(cpf[9])) return false;
  const d2 = calc(cpf.slice(0, 10), 11);
  return d2 === Number(cpf[10]);
}

const CreatePixSchema = z.object({
  planKey: z.enum(Object.keys(PLANS) as [PlanKey, ...PlanKey[]]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  cpf: z.string().trim().min(11).max(14).refine(isValidCPF, "CPF inválido"),
  about: z.string().trim().max(2000).optional().default(""),
});

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export const createPixOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CreatePixSchema.parse(input))
  .handler(async ({ data }) => {
    const plan = PLANS[data.planKey];
    const stripe = getStripe();

    const pi = await stripe.paymentIntents.create({
      amount: plan.amount_cents,
      currency: "brl",
      payment_method_types: ["pix"],
      description: `${plan.label} — HyroCode`,
      receipt_email: data.email,
      metadata: {
        plan_key: plan.key,
        customer_name: data.name,
        customer_cpf: data.cpf.replace(/\D/g, ""),
      },
      payment_method_data: {
        type: "pix",
        billing_details: {
          name: data.name,
          email: data.email,
        },
      },
      confirm: true,
    });

    const next = pi.next_action;
    const pix = next?.type === "pix_display_qr_code" ? next.pix_display_qr_code : null;
    if (!pix || !pix.data) {
      throw new Error("Não foi possível gerar o Pix. Tente novamente.");
    }

    const qrImage = await QRCode.toDataURL(pix.data, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 360,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    });

    const expiresAt = pix.expires_at ? new Date(pix.expires_at * 1000).toISOString() : null;

    const { data: row, error } = await supabaseAdmin
      .from("pix_orders")
      .insert({
        plan_key: plan.key,
        amount_cents: plan.amount_cents,
        currency: "brl",
        customer_name: data.name,
        customer_email: data.email,
        customer_cpf: data.cpf.replace(/\D/g, ""),
        customer_about: data.about || null,
        status: "pending",
        stripe_payment_intent_id: pi.id,
        pix_qr_data: pix.data,
        pix_qr_image_url: qrImage,
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("pix_orders insert error", error);
      throw new Error("Não foi possível registrar o pedido. Tente novamente.");
    }

    return {
      orderId: row.id as string,
      amountCents: plan.amount_cents,
      qrImage,
      qrCopyPaste: pix.data,
      expiresAt,
    };
  });

const GetSchema = z.object({ orderId: z.string().uuid() });

export const getPixOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GetSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("pix_orders")
      .select("status, expires_at, amount_cents")
      .eq("id", data.orderId)
      .single();
    if (error || !row) throw new Error("Pedido não encontrado.");
    return {
      status: row.status as "pending" | "paid" | "expired" | "failed",
      expiresAt: row.expires_at,
      amountCents: row.amount_cents,
    };
  });
