import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/api/public/admin-stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!checkAuth(request)) return Response.json({ ok: false }, { status: 401 });

        const now = Date.now();
        const d30 = new Date(now - 30 * 86400_000).toISOString();
        const d7 = new Date(now - 7 * 86400_000).toISOString();
        const d1 = new Date(now - 86400_000).toISOString();

        const [visitors30, visitors7, visitors1, submissions, byDay, byDevice] =
          await Promise.all([
            supabaseAdmin
              .from("visitor_events")
              .select("id", { count: "exact", head: true })
              .gte("created_at", d30),
            supabaseAdmin
              .from("visitor_events")
              .select("id", { count: "exact", head: true })
              .gte("created_at", d7),
            supabaseAdmin
              .from("visitor_events")
              .select("id", { count: "exact", head: true })
              .gte("created_at", d1),
            supabaseAdmin
              .from("contact_submissions")
              .select("id", { count: "exact", head: true }),
            supabaseAdmin
              .from("visitor_events")
              .select("created_at")
              .gte("created_at", d30)
              .limit(5000),
            supabaseAdmin
              .from("visitor_events")
              .select("device")
              .gte("created_at", d30)
              .limit(5000),
          ]);

        // Aggregate per day
        const dayMap = new Map<string, number>();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now - i * 86400_000).toISOString().slice(0, 10);
          dayMap.set(d, 0);
        }
        for (const r of byDay.data ?? []) {
          const k = (r as { created_at: string }).created_at.slice(0, 10);
          dayMap.set(k, (dayMap.get(k) ?? 0) + 1);
        }
        const series = Array.from(dayMap, ([date, count]) => ({ date, count }));

        const deviceMap = new Map<string, number>();
        for (const r of byDevice.data ?? []) {
          const k = (r as { device: string }).device || "desktop";
          deviceMap.set(k, (deviceMap.get(k) ?? 0) + 1);
        }
        const devices = Array.from(deviceMap, ([name, value]) => ({ name, value }));

        return Response.json({
          ok: true,
          kpis: {
            visitors24h: visitors1.count ?? 0,
            visitors7d: visitors7.count ?? 0,
            visitors30d: visitors30.count ?? 0,
            submissions: submissions.count ?? 0,
          },
          series,
          devices,
        });
      },
    },
  },
});
