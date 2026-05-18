import { createFileRoute } from "@tanstack/react-router";

function timingSafeEqualStr(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export const Route = createFileRoute("/api/public/admin-login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.ADMIN_TOKEN;
        if (!expected) {
          return Response.json({ ok: false, error: "ADMIN_TOKEN not configured" }, { status: 500 });
        }
        let body: { token?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const token = (body.token || "").trim();
        if (!token || !timingSafeEqualStr(token, expected)) {
          return Response.json({ ok: false, error: "Token inválido" }, { status: 401 });
        }
        return Response.json({ ok: true, token });
      },
    },
  },
});
