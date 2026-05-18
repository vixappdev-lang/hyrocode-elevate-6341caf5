import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function checkAuth(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const got = request.headers.get("x-admin-token") || "";
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

const PlanSchema = z.object({
  url: z.string().trim().max(500).optional().default(""),
  label: z.string().trim().min(1).max(60),
});
const ButtonsSchema = z.object({
  essencial: PlanSchema,
  pro: PlanSchema,
  premium: PlanSchema,
});

export const Route = createFileRoute("/api/public/admin-settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!checkAuth(request)) return Response.json({ ok: false }, { status: 401 });
        const { data } = await supabaseAdmin
          .from("site_settings")
          .select("key,value")
          .eq("key", "pricing_buttons")
          .maybeSingle();
        return Response.json({ ok: true, value: data?.value ?? null });
      },
      PUT: async ({ request }) => {
        if (!checkAuth(request)) return Response.json({ ok: false }, { status: 401 });
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = ButtonsSchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
        }
        const { error } = await supabaseAdmin
          .from("site_settings")
          .upsert({
            key: "pricing_buttons",
            value: parsed.data,
            updated_at: new Date().toISOString(),
          });
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});
