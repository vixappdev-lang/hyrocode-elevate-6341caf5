import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";
import { TOKEN_KEY } from "./admin";

export const Route = createFileRoute("/admin/configuracoes")({
  component: ConfiguracoesPage,
});

type PlanCfg = { url: string; label: string };
type Buttons = { essencial: PlanCfg; pro: PlanCfg };

const DEFAULTS: Buttons = {
  essencial: { url: "", label: "QUERO ESSE" },
  pro: { url: "", label: "Entrar em contato" },
};

const PLAN_LABELS: Record<keyof Buttons, string> = {
  essencial: "Landing Page Premium",
  pro: "Sistemas & Painéis",
};

function ConfiguracoesPage() {
  const [buttons, setButtons] = useState<Buttons>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch("/api/public/admin-settings", { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.value) {
          const incoming = d.value as Partial<Buttons>;
          setButtons({
            essencial: { ...DEFAULTS.essencial, ...incoming.essencial },
            pro: { ...DEFAULTS.pro, ...incoming.pro },
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/public/admin-settings", {
        method: "PUT",
        headers: { "x-admin-token": token, "Content-Type": "application/json" },
        body: JSON.stringify(buttons),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalize somente os 2 planos publicados na área de preços do site.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </header>

      {loading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-white/[0.06] bg-card/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(buttons) as (keyof Buttons)[]).map((k) => (
            <PlanCard
              key={k}
              title={PLAN_LABELS[k]}
              value={buttons[k]}
              onChange={(v) => setButtons((b) => ({ ...b, [k]: v }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  title,
  value,
  onChange,
}: {
  title: string;
  value: PlanCfg;
  onChange: (v: PlanCfg) => void;
}) {
  return (
    <div
      className="rounded-2xl border border-white/[0.06] bg-card/60 p-5 space-y-3"
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
    >
      <h3 className="text-sm font-medium">{title}</h3>
      <label className="block">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">URL do botão</span>
        <input
          type="url"
          placeholder="https://wa.me/... ou link de pagamento"
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-background/60 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </label>
      <label className="block">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Texto do botão</span>
        <input
          type="text"
          maxLength={60}
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-background/60 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </label>
      <div className="pt-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Preview</span>
        <div className="mt-1.5 rounded-xl border border-white/[0.05] bg-background/40 p-3">
          <button className="w-full rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider text-background">
            {value.label || "QUERO ESSE"}
          </button>
          {value.url && (
            <p className="mt-2 truncate text-[10px] text-muted-foreground">→ {value.url}</p>
          )}
        </div>
      </div>
    </div>
  );
}
