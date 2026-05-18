import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { UAParser } from "ua-parser-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BodySchema = z.object({
  path: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
});

// Naive in-memory rate limit (per worker instance)
const buckets = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

function getIp(request: Request) {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

async function geoLookup(ip: string) {
  if (!ip || ip.startsWith("127.") || ip === "0.0.0.0" || ip.startsWith("::1")) {
    return null;
  }
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "HyroCode-Tracker/1.0" },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const d = (await res.json()) as Record<string, unknown>;
    return d;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const headerConsent = request.headers.get("x-hc-consent") === "accepted";
        const consent = (request.headers.get("cookie") || "")
          .split(";")
          .map((s) => s.trim())
          .find((c) => c.startsWith("hc_consent="));
        if (!headerConsent && (!consent || !consent.includes("accepted"))) {
          return Response.json({ ok: true, tracked: false, reason: "no_consent" });
        }

        const ip = getIp(request);
        if (!rateLimit(ip)) {
          return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          raw = {};
        }
        const parsed = BodySchema.safeParse(raw);
        const data = parsed.success ? parsed.data : { path: undefined, referrer: undefined };

        const ua = request.headers.get("user-agent") || "";
        const parser = new UAParser(ua);
        const browser = parser.getBrowser();
        const os = parser.getOS();
        const device = parser.getDevice();

        const geo = await geoLookup(ip);
        const isVpn = Boolean(
          (geo?.proxy as boolean | undefined) ?? false,
        );
        const isProxy = Boolean(
          (geo?.hosting as boolean | undefined) ?? (geo?.proxy as boolean | undefined) ?? false,
        );

        const { error } = await supabaseAdmin.from("visitor_events").insert({
          ip,
          country: (geo?.country_name as string) || null,
          country_code: (geo?.country_code as string) || null,
          region: (geo?.region as string) || null,
          city: (geo?.city as string) || null,
          lat: (geo?.latitude as number) ?? null,
          lng: (geo?.longitude as number) ?? null,
          timezone: (geo?.timezone as string) || null,
          device: device.type || "desktop",
          os: [os.name, os.version].filter(Boolean).join(" ") || null,
          browser: [browser.name, browser.version].filter(Boolean).join(" ") || null,
          user_agent: ua.slice(0, 500),
          referrer: (data.referrer || "").slice(0, 500) || null,
          path: (data.path || "/").slice(0, 500),
          is_vpn: isVpn,
          is_proxy: isProxy,
          is_mobile: device.type === "mobile" || device.type === "tablet",
          asn: (geo?.asn as string) || null,
          isp: (geo?.org as string) || null,
        });
        if (error) console.error("track insert", error);

        return Response.json({ ok: true, tracked: !error });
      },
    },
  },
});
