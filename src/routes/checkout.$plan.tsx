import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, ShieldCheck, Copy, CheckCircle2, ArrowLeft, QrCode } from "lucide-react";
import logo from "@/assets/hyrocode-logo-trim.png";
import { createPixOrder, getPixOrder } from "@/lib/checkout.functions";

const PLAN_INFO: Record<string, { label: string; amount: number; bullets: string[] }> = {
  "landing-premium": {
    label: "Landing Page Premium",
    amount: 49700,
    bullets: [
      "Design exclusivo + logotipo",
      "Estrutura responsiva e SEO básico",
      "2 rodadas de alterações inclusas",
      "Garantia de desempenho",
    ],
  },
};

export const Route = createFileRoute("/checkout/$plan")({
  head: () => ({
    meta: [
      { title: "Checkout seguro — HyroCode" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function maskCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function CheckoutPage() {
  const { plan: planParam } = useParams({ from: "/checkout/$plan" });
  const plan = PLAN_INFO[planParam];

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground">Plano não encontrado</h1>
          <Link to="/" className="mt-4 inline-block text-primary underline">Voltar ao site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Voltar ao site
        </Link>
        <Inner planKey={planParam} plan={plan} />
      </div>
      <FooterTrust />
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-white/[0.06] bg-card/40">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HyroCode" className="h-7 sm:h-8 w-auto" draggable={false} />
        </Link>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <Lock className="size-3.5 text-foreground/70" />
          <span className="hidden sm:inline">Ambiente seguro • SSL 256-bit</span>
          <span className="sm:hidden">Pagamento seguro</span>
        </div>
      </div>
    </header>
  );
}

function FooterTrust() {
  return (
    <div className="border-t border-white/[0.06] mt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> LGPD</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" /> SSL 256-bit</span>
          <span className="inline-flex items-center gap-1.5"><QrCode className="size-3.5" /> Pix</span>
        </div>
        <p>© {new Date().getFullYear()} HyroCode. Pagamento processado com segurança.</p>
      </div>
    </div>
  );
}

type CreatedOrder = {
  orderId: string;
  amountCents: number;
  qrImage: string;
  qrCopyPaste: string;
  expiresAt: string | null;
};

function Inner({ planKey, plan }: { planKey: string; plan: (typeof PLAN_INFO)[string] }) {
  const [step, setStep] = useState<"form" | "pix" | "paid">("form");
  const [order, setOrder] = useState<CreatedOrder | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
      <div className="order-2 lg:order-1">
        {step === "form" && (
          <CheckoutForm
            planKey={planKey}
            onCreated={(o) => {
              setOrder(o);
              setStep("pix");
            }}
          />
        )}
        {step === "pix" && order && (
          <PixDisplay order={order} onPaid={() => setStep("paid")} />
        )}
        {step === "paid" && <PaidScreen />}
      </div>
      <aside className="order-1 lg:order-2">
        <OrderSummary plan={plan} />
      </aside>
    </div>
  );
}

function OrderSummary({ plan }: { plan: (typeof PLAN_INFO)[string] }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 sm:p-6 lg:sticky lg:top-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Resumo do pedido
      </h2>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-foreground">{plan.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">Pagamento via Pix • à vista</p>
        </div>
        <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
          {formatBRL(plan.amount)}
        </p>
      </div>

      <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-4">
        {plan.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5 mt-0.5 text-foreground/70 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="font-display text-xl font-bold text-foreground">{formatBRL(plan.amount)}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
        <div className="rounded-lg border border-white/[0.06] bg-background/40 px-2 py-2 text-center">
          <ShieldCheck className="mx-auto size-4 text-foreground/70" />
          <span className="mt-1 block">LGPD</span>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-background/40 px-2 py-2 text-center">
          <Lock className="mx-auto size-4 text-foreground/70" />
          <span className="mt-1 block">SSL</span>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-background/40 px-2 py-2 text-center">
          <QrCode className="mx-auto size-4 text-foreground/70" />
          <span className="mt-1 block">Pix</span>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-white/10 bg-background/60 px-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60";

function CheckoutForm({ planKey, onCreated }: { planKey: string; onCreated: (o: CreatedOrder) => void }) {
  const createFn = useServerFn(createPixOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", cpf: "", about: "" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.cpf) {
      setError("Preencha nome, email e CPF.");
      return;
    }
    setLoading(true);
    try {
      const result = await createFn({
        data: {
          planKey: planKey as "landing-premium",
          name: form.name,
          email: form.email,
          cpf: form.cpf,
          about: form.about,
        },
      });
      onCreated(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar o Pix.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 sm:p-7">
      <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
        Seus dados
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Preencha para gerar o Pix. Seus dados são protegidos conforme a LGPD.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Nome completo *
          </label>
          <input
            required maxLength={120}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Como aparece no seu documento"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Email *
          </label>
          <input
            required type="email" maxLength={255} inputMode="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seuemail@exemplo.com"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            CPF *
          </label>
          <input
            required inputMode="numeric" maxLength={14}
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
            placeholder="000.000.000-00"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Sobre o projeto (opcional)
          </label>
          <textarea
            rows={3} maxLength={2000}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Conte rapidamente o que você precisa"
            className="w-full resize-none rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/60"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold tracking-wide text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> Gerando Pix...</>
          ) : (
            <>Continuar para o Pix</>
          )}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          Ao continuar você concorda com a nossa Política de Privacidade (LGPD).
        </p>
      </form>
    </div>
  );
}

function PixDisplay({ order, onPaid }: { order: CreatedOrder; onPaid: () => void }) {
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<string>("");
  const getFn = useServerFn(getPixOrder);
  const polledRef = useRef(false);

  const expiresMs = useMemo(() => (order.expiresAt ? new Date(order.expiresAt).getTime() : null), [order.expiresAt]);

  useEffect(() => {
    if (!expiresMs) return;
    const tick = () => {
      const left = Math.max(0, expiresMs - Date.now());
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setRemaining(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresMs]);

  useEffect(() => {
    if (polledRef.current) return;
    polledRef.current = true;
    let active = true;
    const poll = async () => {
      while (active) {
        try {
          const res = await getFn({ data: { orderId: order.orderId } });
          if (res.status === "paid") {
            onPaid();
            return;
          }
          if (res.status === "failed" || res.status === "expired") return;
        } catch {}
        await new Promise((r) => setTimeout(r, 4000));
      }
    };
    poll();
    return () => {
      active = false;
    };
  }, [order.orderId, getFn, onPaid]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.qrCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 sm:p-7">
      <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
        Pague com Pix
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Abra o app do seu banco, escaneie o QR code ou use o Pix copia e cola.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-2xl border border-white/[0.08] bg-white p-4">
          <img
            src={order.qrImage}
            alt="QR Code Pix"
            className="block w-[240px] h-[240px] sm:w-[260px] sm:h-[260px]"
          />
        </div>
        {remaining && (
          <p className="mt-3 text-xs text-muted-foreground">
            Expira em <span className="text-foreground font-medium">{remaining}</span>
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Valor: <span className="text-foreground font-medium">{formatBRL(order.amountCents)}</span>
        </p>
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Pix copia e cola
        </label>
        <textarea
          readOnly
          value={order.qrCopyPaste}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-background/60 px-4 py-3 font-mono text-xs text-foreground/80 break-all outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:translate-y-[-1px]"
        >
          {copied ? (
            <><CheckCircle2 className="size-4" /> Copiado!</>
          ) : (
            <><Copy className="size-4" /> Copiar Pix</>
          )}
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.06] bg-background/40 px-4 py-3 text-xs text-muted-foreground">
        Aguardando confirmação do pagamento… esta página atualiza automaticamente
        assim que o Pix for compensado (geralmente em segundos).
      </div>
    </div>
  );
}

function PaidScreen() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-7 sm:p-10 text-center">
      <div
        className="mx-auto flex size-16 items-center justify-center rounded-full"
        style={{ background: "var(--gradient-primary)" }}
      >
        <CheckCircle2 className="size-8 text-background" strokeWidth={2.4} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold text-foreground">
        Pagamento confirmado!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Recebemos seu Pix. Em até <span className="text-foreground">24 horas</span> nossa equipe
        entrará em contato pelo email cadastrado para iniciar o seu projeto.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background"
      >
        Voltar ao site
      </Link>
    </div>
  );
}
