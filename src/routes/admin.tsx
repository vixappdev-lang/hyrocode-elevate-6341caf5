import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  LayoutDashboard,
  Radar,
  Inbox,
  Settings,
  LogOut,
  Lock,
  Loader2,
} from "lucide-react";

export const TOKEN_KEY = "hyro_admin_token";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel HyroCode" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: AdminLayout,
});

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/rastreio", label: "Rastreio", icon: Radar },
  { to: "/admin/solicitacoes", label: "Solicitações", icon: Inbox },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

function AdminLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && token && path === "/admin") {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [hydrated, token, path, navigate]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return (
      <LoginScreen
        onAuthenticated={(t) => {
          localStorage.setItem(TOKEN_KEY, t);
          setToken(t);
        }}
      />
    );
  }

  const active = items.find((i) => path.startsWith(i.to));
  const pageTitle = active?.label ?? "Painel";

  const onLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar — sem traffic lights */}
      <header className="fixed inset-x-0 top-0 z-30 h-14 border-b border-white/[0.05] bg-background/70 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">HyroCode</span>
            <span className="text-xs text-muted-foreground/40">/</span>
            <span className="text-sm font-medium text-foreground">{pageTitle}</span>
          </div>
        </div>
      </header>

      {/* Dock glass — fixo no topo (PC) e no rodapé (celular) — mesmo design */}
      <DockMenu path={path} onLogout={onLogout} />

      {/* Content */}
      <main className="pt-20 pb-28 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function DockMenu({ path, onLogout }: { path: string; onLogout: () => void }) {
  return (
    <>
      {/* Desktop: top centered */}
      <div className="fixed left-1/2 top-3 z-40 hidden -translate-x-1/2 lg:block">
        <DockInner path={path} onLogout={onLogout} />
      </div>
      {/* Mobile: bottom centered */}
      <div className="fixed left-1/2 bottom-4 z-40 -translate-x-1/2 lg:hidden">
        <DockInner path={path} onLogout={onLogout} />
      </div>
    </>
  );
}

function DockInner({ path, onLogout }: { path: string; onLogout: () => void }) {
  return (
    <div
      className="flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1.5 backdrop-blur-2xl"
      style={{
        boxShadow:
          "0 10px 40px -10px rgba(0,0,0,.6), inset 0 1px 0 0 rgba(255,255,255,0.06)",
      }}
    >
      {items.map((item) => {
        const isActive = path.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            title={item.label}
            aria-label={item.label}
            className={`group relative grid size-11 place-items-center rounded-xl transition ${
              isActive
                ? "bg-primary text-primary-foreground shadow-[0_6px_20px_-6px_hsl(var(--primary)/0.6)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
            }`}
          >
            <Icon className="size-[18px]" strokeWidth={1.7} />
            {/* tooltip */}
            <span
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-background/95 px-2 py-1 text-[10px] text-foreground opacity-0 shadow transition group-hover:opacity-100 lg:top-full lg:mt-2 ${
                "max-lg:bottom-full max-lg:mb-2"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      <span className="mx-1 h-7 w-px bg-white/[0.08]" />
      <button
        onClick={onLogout}
        title="Sair"
        aria-label="Sair"
        className="grid size-11 place-items-center rounded-xl text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground"
      >
        <LogOut className="size-[18px]" strokeWidth={1.7} />
      </button>
    </div>
  );
}

function LoginScreen({ onAuthenticated }: { onAuthenticated: (t: string) => void }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Token inválido");
        return;
      }
      onAuthenticated(data.token);
    } catch {
      setError("Falha ao validar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-card p-7"
           style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-primary">
          <Lock className="size-3.5" />
          Acesso restrito
        </div>
        <h1 className="mt-3 text-xl font-semibold text-foreground">Painel HyroCode</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Informe sua chave para acessar o painel.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Chave de acesso"
            autoFocus
            className="w-full rounded-xl border border-white/[0.08] bg-background/60 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-white/20"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
