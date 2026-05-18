import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox, Mail, MessageCircle } from "lucide-react";
import { TOKEN_KEY } from "./admin";

export const Route = createFileRoute("/admin/solicitacoes")({
  component: SolicitacoesPage,
});

type Submission = {
  id: string;
  nome: string;
  email: string;
  estado: string;
  whatsapp: string;
  descricao: string | null;
  created_at: string;
};

function SolicitacoesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [data, setData] = useState<{ rows: Submission[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (p: number) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/admin-contacts?page=${p}&pageSize=${pageSize}`, {
        headers: { "x-admin-token": token },
      });
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
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Solicitações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} no total` : "Carregando…"}
          </p>
        </div>
      </header>

      {loading && !data ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse border-b border-border/60 last:border-b-0 bg-foreground/[0.03]" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</div>
      ) : data && data.rows.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-card p-12 text-center">
          <Inbox className="mx-auto size-8 text-muted-foreground/60" />
          <h3 className="mt-4 text-base font-medium">Nenhuma solicitação ainda</h3>
        </div>
      ) : (
        <>
          <SubmissionList rows={data!.rows} />
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs hover:border-white/20 disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" /> Anterior
              </button>
              <span className="text-xs text-muted-foreground">
                Página <span className="text-foreground">{page}</span> de {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages || loading}
                className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs hover:border-white/20 disabled:opacity-40"
              >
                Próxima <ChevronRight className="size-3.5" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function SubmissionList({ rows }: { rows: Submission[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/60 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-[1.2fr_.9fr_.7fr_.9fr_auto] gap-4 border-b border-border bg-foreground/[0.025] px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
        <span>Nome</span>
        <span>Contato</span>
        <span>Estado</span>
        <span>Recebido</span>
        <span className="text-right">Ações</span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => <SubmissionRow key={row.id} row={row} />)}
      </ul>
    </div>
  );
}

function SubmissionRow({ row }: { row: Submission }) {
  const date = new Date(row.created_at).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const wa = row.whatsapp.replace(/\D/g, "");
  return (
    <li className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-foreground/[0.025] lg:grid-cols-[1.2fr_.9fr_.7fr_.9fr_auto] lg:items-center lg:gap-4">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{row.nome}</h3>
        {row.descricao && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground lg:max-w-md">
            {row.descricao}
          </p>
        )}
      </div>
      <div className="min-w-0 text-xs text-muted-foreground">
        <p className="truncate">{row.email}</p>
        <p className="mt-1 truncate">{row.whatsapp}</p>
      </div>
      <div>
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {row.estado}
        </span>
      </div>
      <time className="text-xs text-muted-foreground">{date}</time>
      <div className="flex items-center gap-2 lg:justify-end">
        <a href={`https://wa.me/55${wa}`} target="_blank" rel="noopener"
           className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-foreground/20">
          <MessageCircle className="size-3.5" /> WhatsApp
        </a>
        <a href={`mailto:${row.email}`}
           className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-foreground/20">
          <Mail className="size-3.5" /> Responder
        </a>
      </div>
    </li>
  );
}
