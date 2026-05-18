import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TOKEN_KEY } from "./admin";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, MousePointerClick, Globe, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

type Stats = {
  kpis: { visitors24h: number; visitors7d: number; visitors30d: number; submissions: number };
  series: { date: string; count: number }[];
  devices: { name: string; value: number }[];
};

const PIE_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#f59e0b", "#f43f5e"];

function DashboardPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch("/api/public/admin-stats", { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Métricas em tempo real do site e das solicitações.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={MousePointerClick} label="Visitantes 24h" value={data?.kpis.visitors24h} loading={loading} />
        <Kpi icon={Users} label="Visitantes 7d" value={data?.kpis.visitors7d} loading={loading} />
        <Kpi icon={Globe} label="Visitantes 30d" value={data?.kpis.visitors30d} loading={loading} />
        <Kpi icon={Inbox} label="Solicitações" value={data?.kpis.submissions} loading={loading} accent />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 p-5 min-h-[320px]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium">Visitantes — últimos 30 dias</h2>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">diário</span>
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={data?.series ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 min-h-[320px]">
          <h2 className="text-sm font-medium">Dispositivos</h2>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data?.devices ?? []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={92}
                  paddingAngle={2}
                  stroke="none"
                >
                  {(data?.devices ?? []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {(data?.devices ?? []).map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {d.name}
                </span>
                <span className="text-foreground">{d.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-card/60 ${className}`}
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
    >
      {children}
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  loading,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | undefined;
  loading: boolean;
  accent?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`inline-flex size-7 items-center justify-center rounded-lg ${accent ? "bg-primary/15 text-primary" : "bg-white/[0.05] text-muted-foreground"}`}>
          <Icon className="size-3.5" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">
        {loading ? "—" : (value ?? 0).toLocaleString("pt-BR")}
      </div>
    </Card>
  );
}
