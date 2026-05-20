import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2, Lock, ShieldCheck, Copy, CheckCircle2, ArrowLeft, QrCode, Clock, BadgeCheck, Smartphone,
} from "lucide-react";
import logo from "@/assets/hyrocode-logo-trim.png";
import { generatePix, getCheckoutOrder, getOrderStatus } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout/$orderId")({
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
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

type OrderData = Awaited<ReturnType<typeof getCheckoutOrder>>;

function CheckoutPage() {
  const { orderId } = useParams({ from: "/checkout/$orderId" });
  const getFn = useServerFn(getCheckoutOrder);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getFn({ data: { orderId } })
      .then((o) => active && setOrder(o))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : "Erro ao carregar pedido."));
    return () => { active = false; };
  }, [orderId, getFn]);

  if (error) return <CenterMsg title="Pedido não encontrado" message={error} />;
  if (!order) return <CenterMsg title="Carregando…" message="Buscando seu pedido com segurança." spinner />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TrustBanner />
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" /> Voltar ao site
        </Link>
        <Inner order={order} onUpdate={setOrder} />
      </main>
      <FooterTrust />
    </div>
  );
}

function CenterMsg({ title, message, spinner }: { title: string; message: string; spinner?: boolean }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm text-center">
        {spinner && <Loader2 className="mx-auto mb-4 size-6 animate-spin text-muted-foreground" />}
        <h1 className="font-display text-xl text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Link to="/" className="mt-5 inline-block text-sm text-primary underline">Voltar ao site</Link>
      </div>
    </div>
  );
}

function TrustBanner() {
  return (
    <div className="w-full border-b border-white/[0.06] bg-foreground/[0.03]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5 text-foreground/70" /> Pagamento 100% seguro</span>
        <span className="hidden sm:inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-foreground/70" /> Criptografia SSL 256-bit</span>
        <span className="inline-flex items-center gap-1.5"><QrCode className="size-3.5 text-foreground/70" /> Pix instantâneo</span>
        <span className="hidden md:inline-flex items-center gap-1.5"><BadgeCheck className="size-3.5 text-foreground/70" /> LGPD</span>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HyroCode" className="h-7 sm:h-8 w-auto" draggable={false} />
        </Link>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <Lock className="size-3.5 text-foreground/70" />
          <span>Ambiente seguro</span>
        </div>
      </div>
    </header>
  );
}

function FooterTrust() {
  return (
    <footer className="border-t border-white/[0.06] mt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> LGPD</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" /> SSL 256-bit</span>
          <span className="inline-flex items-center gap-1.5"><QrCode className="size-3.5" /> Pix</span>
        </div>
        <p>© {new Date().getFullYear()} HyroCode. Pagamento processado com segurança.</p>
      </div>
    </footer>
  );
}

function Inner({ order, onUpdate }: { order: OrderData; onUpdate: (o: OrderData) => void }) {
  const initialStep: "form" | "pix" | "paid" =
    order.status === "paid" ? "paid" :
    order.status === "pending" && order.qrCopyPaste && order.qrImage ? "pix" : "form";
  const [step, setStep] = useState<typeof initialStep>(initialStep);
  const [pixData, setPixData] = useState<{ qrImage: string; qrCopyPaste: string; expiresAt: string | null } | null>(
    step === "pix" && order.qrImage && order.qrCopyPaste
      ? { qrImage: order.qrImage, qrCopyPaste: order.qrCopyPaste, expiresAt: order.expiresAt }
      : null
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 lg:gap-8">
      <section className="order-2 lg:order-1">
        {step === "form" && (
          <CheckoutForm
            orderId={order.orderId}
            onCreated={(p) => { setPixData(p); setStep("pix"); }}
          />
        )}
        {step === "pix" && pixData && (
          <PixDisplay
            orderId={order.orderId}
            amountCents={order.plan.amount_cents}
            pix={pixData}
            onPaid={() => { setStep("paid"); onUpdate({ ...order, status: "paid" }); }}
          />
        )}
        {step === "paid" && <PaidScreen />}
      </section>
      <aside className="order-1 lg:order-2">
        <OrderSummary plan={order.plan} />
      </aside>
    </div>
  );
}

function OrderSummary({ plan }: { plan: OrderData["plan"] }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 sm:p-6 lg:sticky lg:top-6">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Resumo do pedido
      </h2>
      <div className="mt-4">
        <p className="font-display text-base font-semibold text-foreground">{plan.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{plan.description}</p>
      </div>

      <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
        {plan.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5 mt-0.5 text-foreground/70 shrink-0" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-1 border-t border-white/[0.06] pt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatBRL(plan.amount_cents)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Desconto Pix</span>
          <span className="text-foreground/80">— inclusos</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-display text-xl font-bold text-foreground">{formatBRL(plan.amount_cents)}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
        {[
          { Icon: ShieldCheck, label: "LGPD" },
          { Icon: Lock, label: "SSL" },
          { Icon: QrCode, label: "Pix" },
        ].map(({ Icon, label }) => (
          <div key={label} className="rounded-lg border border-white/[0.06] bg-background/40 px-2 py-2 text-center">
            <Icon className="mx-auto size-4 text-foreground/70" />
            <span className="mt-1 block">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-white/10 bg-background/60 px-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

function CheckoutForm({ orderId, onCreated }: {
  orderId: string;
  onCreated: (p: { qrImage: string; qrCopyPaste: string; expiresAt: string | null }) => void;
}) {
  const createFn = useServerFn(generatePix);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", cpf: "" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.cpf) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const result = await createFn({
        data: { orderId, name: form.name, email: form.email, cpf: form.cpf },
      });
      onCreated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar o Pix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Identificação</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Etapa 1 de 2 — preencha para gerar seu Pix.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-background/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          <Smartphone className="size-3.5" /> Pix
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Nome completo">
          <input
            required maxLength={120} autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Como aparece no seu documento"
            className={inputCls}
          />
        </Field>

        <Field label="Email">
          <input
            required type="email" maxLength={255} inputMode="email" autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seuemail@exemplo.com"
            className={inputCls}
          />
        </Field>

        <Field label="CPF">
          <input
            required inputMode="numeric" maxLength={14} autoComplete="off"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
            placeholder="000.000.000-00"
            className={inputCls}
          />
        </Field>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-semibold tracking-wide text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (<><Loader2 className="size-4 animate-spin" /> Gerando Pix…</>) : (<>Gerar Pix agora</>)}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          Ao continuar você concorda com a Política de Privacidade (LGPD).
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function PixDisplay({
  orderId, amountCents, pix, onPaid,
}: {
  orderId: string;
  amountCents: number;
  pix: { qrImage: string; qrCopyPaste: string; expiresAt: string | null };
  onPaid: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<string>("");
  const getFn = useServerFn(getOrderStatus);
  const polledRef = useRef(false);

  const expiresMs = useMemo(() => (pix.expiresAt ? new Date(pix.expiresAt).getTime() : null), [pix.expiresAt]);

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
          const res = await getFn({ data: { orderId } });
          if (res.status === "paid") { onPaid(); return; }
          if (res.status === "failed" || res.status === "expired") return;
        } catch { /* keep polling */ }
        await new Promise((r) => setTimeout(r, 4000));
      }
    };
    poll();
    return () => { active = false; };
  }, [orderId, getFn, onPaid]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pix.qrCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Pague com Pix</h1>
          <p className="mt-1 text-sm text-muted-foreground">Etapa 2 de 2 — escaneie ou copie o código.</p>
        </div>
        {remaining && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-background/40 px-3 py-1.5 text-[11px] text-muted-foreground">
            <Clock className="size-3.5" /> {remaining}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-2xl border border-white/[0.08] bg-white p-4 shadow-[var(--shadow-card)]">
          <img src={pix.qrImage} alt="QR Code Pix" className="block w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Valor: <span className="text-foreground font-medium">{formatBRL(amountCents)}</span></span>
          {remaining && (
            <span className="sm:hidden">Expira em <span className="text-foreground font-medium">{remaining}</span></span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Pix copia e cola
        </label>
        <textarea
          readOnly value={pix.qrCopyPaste} rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-background/60 px-4 py-3 font-mono text-xs text-foreground/80 break-all outline-none"
        />
        <button
          type="button" onClick={copy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background transition-all hover:translate-y-[-1px]"
        >
          {copied ? (<><CheckCircle2 className="size-4" /> Copiado!</>) : (<><Copy className="size-4" /> Copiar código Pix</>)}
        </button>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-background/40 px-4 py-3 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 mt-0.5 animate-spin shrink-0" />
        <span>Aguardando confirmação do pagamento… a página atualiza automaticamente assim que o Pix for compensado.</span>
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
      <h1 className="mt-6 font-display text-2xl font-semibold text-foreground">Pagamento confirmado!</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Recebemos seu Pix. Em até <span className="text-foreground">24 horas</span> nossa equipe entrará em contato pelo email cadastrado para iniciar o seu projeto.
      </p>
      <Link to="/" className="mt-7 inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background">
        Voltar ao site
      </Link>
    </div>
  );
}
