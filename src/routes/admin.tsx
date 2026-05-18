import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  LayoutDashboard,
  Radar,
  Inbox,
  Settings,
  LogOut,
  Search,
  Lock,
  Loader2,
} from "lucide-react";
import logo from "@/assets/hyrocode-logo-trim.png";

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

  // Redirect /admin -> /admin/dashboard
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
      {/* Topbar */}
      <header className="fixed inset-x-0 top-0 z-40 h-12 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 pl-1 pr-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">HyroCode</span>
            <span className="text-xs text-muted-foreground/40">/</span>
            <span className="text-sm font-medium text-foreground">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground">
              <Search className="size-3.5" />
              <span>Buscar</span>
              <kbd className="ml-2 rounded border border-white/10 bg-white/5 px-1.5 text-[10px]">⌘K</kbd>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-white/20"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-12 bottom-0 z-30 hidden lg:flex w-[240px] flex-col border-r border-white/[0.06] bg-card/40 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-4">
          <img src={logo} alt="HyroCode" className="h-7 w-auto" draggable={false} />
        </div>
        <nav className="flex-1 px-2 py-2">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const isActive = path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/[0.06] text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-white/[0.06] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">v1.0 · Painel</p>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex lg:hidden border-t border-white/[0.06] bg-card/80 backdrop-blur-xl">
        {items.map((item) => {
          const isActive = path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Content */}
      <main className="pt-12 lg:pl-[240px] pb-16 lg:pb-0 min-h-screen">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </div>
      </main>
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
