import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { TOKEN_KEY } from "./admin";
import { Smartphone, Monitor, Tablet, Shield, ShieldAlert, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/rastreio")({
  component: RastreioPage,
});

const VisitorMap = lazy(() => import("@/components/admin/VisitorMap"));

type Visitor = {
  id: string;
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  isp: string | null;
  is_vpn: boolean | null;
  is_proxy: boolean | null;
  is_mobile: boolean | null;
  path: string | null;
  created_at: string;
};

function maskIp(ip: string | null) {
  if (!ip) return "—";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.•••.•••`;
  return ip.slice(0, 8) + "…";
}

function RastreioPage() {
  const [rows, setRows] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch("/api/public/admin-visitors?days=30&limit=300", {
      headers: { "x-admin-token": token },
    })
      .then((r) => r.json())
      .then((d) => d.ok && setRows(d.rows))
      .finally(() => setLoading(false));
  }, []);

  const withCoords = rows.filter((r) => r.lat != null && r.lng != null);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Rastreio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {rows.length} visitas nos últimos 30 dias · {withCoords.length} com localização precisa
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 min-h-[600px]">
        {/* Map */}
        <div
          className="xl:col-span-3 rounded-2xl border border-white/[0.06] bg-card/60 overflow-hidden relative min-h-[420px] xl:min-h-[640px]"
          style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
        >
          {loading ? (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (
            <Suspense fallback={<div className="absolute inset-0 grid place-items-center"><Loader2 className="size-5 animate-spin" /></div>}>
              <VisitorMap visitors={withCoords} />
            </Suspense>
          )}
        </div>

        {/* List */}
        <div
          className="xl:col-span-2 rounded-2xl border border-white/[0.06] bg-card/60 flex flex-col min-h-[420px] xl:min-h-[640px]"
          style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
        >
          <div className="border-b border-white/[0.06] px-5 py-3">
            <h2 className="text-sm font-medium">Visitantes recentes</h2>
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {rows.length === 0 && !loading && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Nenhum visitante registrado ainda. Os dados começam após o primeiro aceite de cookies.
              </li>
            )}
            {rows.map((r) => (
              <VisitorRow key={r.id} v={r} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VisitorRow({ v }: { v: Visitor }) {
  const DeviceIcon = v.device === "mobile" ? Smartphone : v.device === "tablet" ? Tablet : Monitor;
  const date = new Date(v.created_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <li className="px-5 py-3 hover:bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <DeviceIcon className="size-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="truncate text-foreground">
                {v.city || "—"}{v.region ? `, ${v.region}` : ""}
              </span>
              {v.country && (
                <span className="shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                  {v.country}
                </span>
              )}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {v.browser || "?"} · {v.os || "?"} · IP {maskIp(v.ip)}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {v.is_vpn || v.is_proxy ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
              <ShieldAlert className="size-3" />
              VPN
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Shield className="size-3" />
              direto
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">{date}</span>
        </div>
      </div>
      {v.isp && (
        <div className="mt-1.5 text-[10px] text-muted-foreground/70 truncate">{v.isp}</div>
      )}
    </li>
  );
}
