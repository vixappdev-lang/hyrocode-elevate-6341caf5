import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function checkAuth(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return { ok: false as const, status: 500, error: "ADMIN_TOKEN not configured" };
  const got = request.headers.get("x-admin-token") || "";
  if (got.length !== expected.length) return { ok: false as const, status: 401, error: "Unauthorized" };
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return { ok: false as const, status: 401, error: "Unauthorized" };
  return { ok: true as const };
}

export const Route = createFileRoute("/api/public/admin-contacts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = checkAuth(request);
        if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status });

        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(url.searchParams.get("pageSize") || "10", 10) || 10));
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await supabaseAdmin
          .from("contact_submissions")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) {
          console.error(error);
          return Response.json({ ok: false, error: "DB error" }, { status: 500 });
        }
        return Response.json({ ok: true, rows: data ?? [], total: count ?? 0, page, pageSize });
      },
    },
  },
});
