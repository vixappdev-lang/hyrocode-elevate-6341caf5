import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Loader2, LogOut, MessageCircle, Mail, ChevronLeft, ChevronRight, Inbox, Lock } from "lucide-react";
import logo from "@/assets/hyrocode-logo.png";

export const Route = createFileRoute("/admin/contatos")({
  head: () => ({
    meta: [
      { title: "Solicitações — HyroCode" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminContatosPage,
});

const TOKEN_KEY = "hyro_admin_token";

type Submission = {
  id: string;
  nome: string;
  email: string;
  estado: string;
  whatsapp: string;
  descricao: string | null;
  created_at: string;
};

function AdminContatosPage() {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setHydrated(true);
  }, []);

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

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }}
    />
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
      setError("Falha ao validar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div
        className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-card p-7"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-primary">
          <Lock className="size-3.5" />
          Acesso restrito
        </div>
        <h1 className="mt-3 text-xl font-semibold text-foreground">Painel HyroCode</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Informe sua chave de acesso para visualizar as solicitações.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Chave de acesso"
            autoFocus
            className="w-full rounded-xl border border-white/[0.08] bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-white/20"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [data, setData] = useState<{ rows: Submission[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/public/admin-contacts?page=${p}&pageSize=${pageSize}`, {
          headers: { "x-admin-token": token },
        });
        if (res.status === 401) {
          onLogout();
          return;
        }
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || "Erro ao carregar");
          return;
        }
        setData({ rows: json.rows, total: json.total });
      } catch {
        setError("Falha de rede");
      } finally {
        setLoading(false);
      }
    },
    [token, onLogout],
  );

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HyroCode" className="h-10 w-auto -my-2" draggable={false} />
            <div className="hidden sm:block h-6 w-px bg-white/10" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Painel</span>
              <span className="text-sm font-medium text-foreground">Solicitações</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-white/20"
          >
            <LogOut className="size-3.5" />
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Solicitações</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data ? `${data.total} no total` : "Carregando…"}
            </p>
          </div>
        </div>

        {loading && !data ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : data && data.rows.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data!.rows.map((row) => (
                <SubmissionCard key={row.id} row={row} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} loading={loading} />
          </>
        )}
      </main>
    </div>
  );
}

function SubmissionCard({ row }: { row: Submission }) {
  const date = new Date(row.created_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const wa = row.whatsapp.replace(/\D/g, "");
  return (
    <article
      className="flex flex-col rounded-2xl border border-white/[0.07] bg-card p-5"
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{row.nome}</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {row.estado}
        </span>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground/70">WhatsApp</dt>
          <dd className="mt-0.5 text-foreground">{row.whatsapp}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground/70">Recebido em</dt>
          <dd className="mt-0.5 text-foreground">{date}</dd>
        </div>
      </dl>

      {row.descricao && (
        <p className="mt-4 line-clamp-4 whitespace-pre-wrap rounded-lg border border-white/[0.05] bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
          {row.descricao}
        </p>
      )}

      <div className="mt-5 flex items-center gap-2 pt-1">
        <a
          href={`https://wa.me/55${wa}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-foreground transition-colors hover:border-white/20"
        >
          <MessageCircle className="size-3.5" />
          WhatsApp
        </a>
        <a
          href={`mailto:${row.email}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-foreground transition-colors hover:border-white/20"
        >
          <Mail className="size-3.5" />
          Responder
        </a>
      </div>
    </article>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
  loading,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  loading: boolean;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1 || loading}
        className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-foreground transition-colors hover:border-white/20 disabled:opacity-40"
      >
        <ChevronLeft className="size-3.5" />
        Anterior
      </button>
      <span className="text-xs text-muted-foreground">
        Página <span className="text-foreground">{page}</span> de {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages || loading}
        className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-foreground transition-colors hover:border-white/20 disabled:opacity-40"
      >
        Próxima
        <ChevronRight className="size-3.5" />
      </button>
    </nav>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-2xl border border-white/[0.06] bg-card/60"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-12 text-center">
      <Inbox className="mx-auto size-8 text-muted-foreground/60" />
      <h3 className="mt-4 text-base font-medium text-foreground">Nenhuma solicitação ainda</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Assim que alguém enviar o formulário, as solicitações aparecerão aqui.
      </p>
    </div>
  );
}
