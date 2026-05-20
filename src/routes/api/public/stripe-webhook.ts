import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_SECRET_KEY;
        const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret || !whSecret) {
          return new Response("Stripe not configured", { status: 500 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const body = await request.text();
        const stripe = new Stripe(secret, { apiVersion: "2026-04-22.dahlia" });

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, whSecret);
        } catch (err) {
          console.error("Invalid Stripe webhook signature", err);
          return new Response("Invalid signature", { status: 400 });
        }

        try {
          if (event.type === "payment_intent.succeeded") {
            const pi = event.data.object as Stripe.PaymentIntent;
            await supabaseAdmin
              .from("pix_orders")
              .update({ status: "paid" })
              .eq("stripe_payment_intent_id", pi.id);
          } else if (
            event.type === "payment_intent.payment_failed" ||
            event.type === "payment_intent.canceled"
          ) {
            const pi = event.data.object as Stripe.PaymentIntent;
            await supabaseAdmin
              .from("pix_orders")
              .update({ status: "failed" })
              .eq("stripe_payment_intent_id", pi.id);
          }
        } catch (err) {
          console.error("Webhook handler error", err);
          return new Response("Handler error", { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});
