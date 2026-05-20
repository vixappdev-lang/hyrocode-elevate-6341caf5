import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2, Lock, ShieldCheck, Copy, CheckCircle2, ArrowLeft, QrCode, Clock,
  BadgeCheck, ChevronDown, ChevronUp, User, Mail, Phone, FileText, HelpCircle,
} from "lucide-react";
import logoMark from "@/assets/hyrocode-mark.jpg";
import { generatePix, getCheckoutOrder, getOrderStatus } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout/$slug")({
  head: () => ({
    meta: [
      { title: "Checkout • Landing Page - HyroCode" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
  component: CheckoutPage,
});

/* -------- utils -------- */
function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

type OrderData = Awaited<ReturnType<typeof getCheckoutOrder>>;

/* -------- shell -------- */
function CheckoutPage() {
  const { slug } = useParams({ from: "/checkout/$slug" });
  const getFn = useServerFn(getCheckoutOrder);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getFn({ data: { slug } })
      .then((o) => active && setOrder(o))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : "Erro ao carregar pedido."));
    return () => { active = false; };
  }, [slug, getFn]);

  if (error) return <CenterMsg title="Pedido não encontrado" message={error} />;
  if (!order) return <CenterMsg title="Carregando…" message="Buscando seu pedido com segurança." spinner />;

  return (
    <div className="min-h-screen text-foreground" style={{ background: "var(--checkout-bg)" }}>
      <TrustBar />
      <TopBar slug={order.slug} />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-5 sm:pt-8 pb-16 sm:pb-12">
        <div className="mb-4 sm:mb-5 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3.5" /> Voltar ao site
          </Link>
        </div>
        <Inner order={order} onUpdate={setOrder} />
      </main>
      <FooterTrust />
    </div>
  );
}

function CenterMsg({ title, message, spinner }: { title: string; message: string; spinner?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--checkout-bg)" }}>
      <div className="max-w-sm text-center">
        {spinner && <Loader2 className="mx-auto mb-4 size-6 animate-spin text-muted-foreground" />}
        <h1 className="font-display text-xl text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Link to="/" className="mt-5 inline-block text-sm text-primary underline">Voltar ao site</Link>
      </div>
    </div>
  );
}

/* -------- chrome -------- */
function TrustBar() {
  return (
    <div className="w-full border-b" style={{ borderColor: "var(--checkout-border)", background: "color-mix(in oklab, white 3%, transparent)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5 text-foreground/70" /> Ambiente 100% seguro</span>
        <span className="hidden sm:inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-foreground/70" /> SSL 256-bit</span>
        <span className="inline-flex items-center gap-1.5"><QrCode className="size-3.5 text-foreground/70" /> Pix instantâneo</span>
        <span className="hidden md:inline-flex items-center gap-1.5"><BadgeCheck className="size-3.5 text-foreground/70" /> LGPD</span>
      </div>
    </div>
  );
}

function TopBar({ slug }: { slug: string }) {
  return (
    <header className="border-b" style={{ borderColor: "var(--checkout-border)" }}>
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoMark} alt="HyroCode" className="h-8 w-8 rounded-md object-cover" draggable={false} />
          <span className="font-display text-base font-semibold tracking-tight text-foreground">HyroCode</span>
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          Pedido <code className="font-mono text-foreground/80">#{slug}</code>
        </span>
      </div>
    </header>
  );
}

function FooterTrust() {
  return (
    <footer className="border-t mt-6" style={{ borderColor: "var(--checkout-border)" }}>
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

/* -------- layout -------- */
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
    <div className="space-y-5 sm:space-y-6">
      <Stepper step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 lg:gap-6 items-start">
        <section className="order-2 lg:order-1 min-w-0">
          {step === "form" && (
            <CheckoutForm
              order={order}
              onCreated={(p) => { setPixData(p); setStep("pix"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}
          {step === "pix" && pixData && (
            <PixDisplay
              slug={order.slug}
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
    </div>
  );
}

/* -------- stepper -------- */
function Stepper({ step }: { step: "form" | "pix" | "paid" }) {
  const items: Array<{ key: typeof step; label: string }> = [
    { key: "form", label: "Identificação" },
    { key: "pix", label: "Pagamento" },
    { key: "paid", label: "Confirmação" },
  ];
  const activeIndex = items.findIndex((i) => i.key === step);
  return (
    <ol className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs overflow-x-auto">
      {items.map((it, idx) => {
        const done = idx < activeIndex;
        const active = idx === activeIndex;
        return (
          <li key={it.key} className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            <span
              className={[
                "flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                done ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" :
                active ? "border-primary/60 bg-primary/25 text-foreground" :
                "border-white/10 bg-white/[0.04] text-muted-foreground",
              ].join(" ")}
            >
              {done ? <CheckCircle2 className="size-3.5" /> : idx + 1}
            </span>
            <span className={active ? "text-foreground font-medium" : "text-muted-foreground"}>{it.label}</span>
            {idx < items.length - 1 && <span className="mx-1 sm:mx-2 hidden sm:block h-px w-8 bg-white/10" />}
          </li>
        );
      })}
    </ol>
  );
}

/* -------- right summary -------- */
function OrderSummary({ plan }: { plan: OrderData["plan"] }) {
  const [open, setOpen] = useState(false);
  const installments = formatBRL(Math.round(plan.amount_cents / 12));

  return (
    <div
      className="rounded-2xl border lg:sticky lg:top-6 overflow-hidden"
      style={{ background: "var(--checkout-surface)", borderColor: "var(--checkout-border)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Green secure header — calm, no neon */}
      <div
        className="flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-emerald-50"
        style={{ background: "linear-gradient(180deg, oklch(0.52 0.13 160) 0%, oklch(0.46 0.13 160) 100%)" }}
      >
        <ShieldCheck className="size-4" /> Compra segura
      </div>

      <div className="flex items-start gap-3 p-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl overflow-hidden border" style={{ borderColor: "var(--checkout-border)" }}>
          <img src={logoMark} alt="" className="size-12 object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[15px] font-semibold text-foreground leading-tight">{plan.label}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Precisa de ajuda?{" "}
            <a href="mailto:contato@hyrocode.online" className="text-primary hover:underline">Fale com o vendedor</a>
          </p>
        </div>
      </div>

      <div className="border-t px-5 py-4" style={{ borderColor: "var(--checkout-border)" }}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-xl font-bold text-foreground">{formatBRL(plan.amount_cents)}</span>
        </div>
        <p className="mt-1 text-right text-[11px] text-muted-foreground">
          ou em até <span className="text-foreground/90">12× de {installments}</span>
        </p>
      </div>

      <div className="border-t px-5 py-3.5" style={{ borderColor: "var(--checkout-border)" }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left lg:cursor-default"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            O que está incluso
          </span>
          <span className="lg:hidden text-muted-foreground">
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </span>
        </button>
        <ul className={`mt-3 space-y-2 ${open ? "block" : "hidden"} lg:block`}>
          {plan.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs text-foreground/85">
              <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-400/90 shrink-0" />
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="px-5 py-4 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground border-t"
        style={{ borderColor: "var(--checkout-border)", background: "var(--checkout-surface-2)" }}
      >
        {[
          { Icon: ShieldCheck, label: "LGPD" },
          { Icon: Lock, label: "SSL 256-bit" },
          { Icon: QrCode, label: "Pix" },
        ].map(({ Icon, label }) => (
          <div key={label} className="text-center">
            <Icon className="mx-auto size-4 text-foreground/70" />
            <span className="mt-1 block">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- form -------- */
const fieldCls =
  "h-12 w-full rounded-xl border pl-10 pr-3 text-[16px] sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/25";
const fieldStyle: React.CSSProperties = {
  background: "var(--checkout-input)",
  borderColor: "var(--checkout-border-strong)",
};

function InputIcon({ Icon }: { Icon: typeof User }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
      <Icon className="size-4" />
    </span>
  );
}

function CheckoutForm({ order, onCreated }: {
  order: OrderData;
  onCreated: (p: { qrImage: string; qrCopyPaste: string; expiresAt: string | null }) => void;
}) {
  const createFn = useServerFn(generatePix);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", cpf: "", phone: "" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.cpf) {
      setError("Preencha nome, email e CPF para gerar seu Pix.");
      return;
    }
    setLoading(true);
    try {
      const result = await createFn({
        data: { slug: order.slug, name: form.name, email: form.email, cpf: form.cpf },
      });
      onCreated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar o Pix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--checkout-surface)", borderColor: "var(--checkout-border)", boxShadow: "var(--shadow-card)" }}
    >
      {/* product header inside left card */}
      <div className="flex items-center gap-3 p-5 sm:p-6 border-b" style={{ borderColor: "var(--checkout-border)", background: "var(--checkout-surface-2)" }}>
        <img src={logoMark} alt="" className="size-12 rounded-xl object-cover border" style={{ borderColor: "var(--checkout-border)" }} />
        <div className="min-w-0">
          <h1 className="font-display text-base sm:text-lg font-semibold text-foreground leading-tight">{order.plan.label}</h1>
          <p className="mt-1 text-[12px] text-foreground/80">
            <span className="font-medium">{formatBRL(order.plan.amount_cents)}</span>
            <span className="text-muted-foreground"> · à vista no Pix</span>
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Seus dados */}
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-primary text-[11px] font-semibold">1</span>
          <h2 className="font-display text-[15px] font-semibold text-foreground">Seus dados</h2>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Nome completo *">
            <div className="relative">
              <InputIcon Icon={User} />
              <input
                required maxLength={120} autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Como aparece no seu documento"
                className={fieldCls} style={fieldStyle}
              />
            </div>
          </Field>

          <Field label="Email *">
            <div className="relative">
              <InputIcon Icon={Mail} />
              <input
                required type="email" maxLength={255} inputMode="email" autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seuemail@exemplo.com"
                className={fieldCls} style={fieldStyle}
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="CPF *">
              <div className="relative">
                <InputIcon Icon={FileText} />
                <input
                  required inputMode="numeric" maxLength={14} autoComplete="off"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  className={fieldCls} style={fieldStyle}
                />
              </div>
            </Field>
            <Field label="Celular">
              <div className="relative">
                <InputIcon Icon={Phone} />
                <input
                  inputMode="tel" maxLength={16} autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                  placeholder="(00) 00000-0000"
                  className={fieldCls} style={fieldStyle}
                />
              </div>
            </Field>
          </div>

          <button
            type="button"
            onClick={() => setShowWhy((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
          >
            <HelpCircle className="size-3.5" /> Porque pedimos esses dados?
          </button>
          {showWhy && (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Usamos seus dados apenas para emitir o Pix, enviar o comprovante por email e iniciar a entrega do seu projeto. Não compartilhamos com terceiros (LGPD).
            </p>
          )}

          {/* Pagamento */}
          <div className="pt-4 mt-2 border-t" style={{ borderColor: "var(--checkout-border)" }}>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-primary text-[11px] font-semibold">2</span>
              <h2 className="font-display text-[15px] font-semibold text-foreground">Forma de pagamento</h2>
            </div>

            <div className="mt-4">
              <div
                className="flex items-center justify-between gap-3 rounded-xl border p-4"
                style={{ borderColor: "var(--primary)", background: "color-mix(in oklab, var(--primary) 8%, transparent)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg" style={{ background: "var(--checkout-surface-2)" }}>
                    <QrCode className="size-5 text-foreground" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pix</p>
                    <p className="text-[11px] text-muted-foreground">Aprovação imediata · sem taxas</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                  <CheckCircle2 className="size-3" /> Recomendado
                </span>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--checkout-border)", background: "var(--checkout-surface-2)" }}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{order.plan.label}</span>
              <span className="text-foreground">{formatBRL(order.plan.amount_cents)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm font-semibold" style={{ borderColor: "var(--checkout-border)" }}>
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{formatBRL(order.plan.amount_cents)}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold tracking-wide text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading
              ? (<><Loader2 className="size-4 animate-spin" /> Gerando Pix…</>)
              : (<><QrCode className="size-4" /> Pagar com Pix</>)}
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            Ambiente protegido pela <span className="text-foreground/80">Stripe</span> · Pagamento processado com segurança.
          </p>
        </form>
      </div>
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

/* -------- pix -------- */
function PixDisplay({
  slug, amountCents, pix, onPaid,
}: {
  slug: string;
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
          const res = await getFn({ data: { slug } });
          if (res.status === "paid") { onPaid(); return; }
          if (res.status === "failed" || res.status === "expired") return;
        } catch { /* keep polling */ }
        await new Promise((r) => setTimeout(r, 4000));
      }
    };
    poll();
    return () => { active = false; };
  }, [slug, getFn, onPaid]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pix.qrCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div
      className="rounded-2xl border p-5 sm:p-7"
      style={{ background: "var(--checkout-surface)", borderColor: "var(--checkout-border)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Pague com Pix</h1>
          <p className="mt-1 text-sm text-muted-foreground">Escaneie o QR Code ou copie o código abaixo.</p>
        </div>
        {remaining && (
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] text-muted-foreground"
            style={{ borderColor: "var(--checkout-border)", background: "var(--checkout-surface-2)" }}
          >
            <Clock className="size-3.5" /> Expira em <span className="text-foreground font-medium">{remaining}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
          <img src={pix.qrImage} alt="QR Code Pix" className="block w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Valor: <span className="text-foreground font-medium">{formatBRL(amountCents)}</span>
        </p>
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Pix copia e cola
        </label>
        <textarea
          readOnly value={pix.qrCopyPaste} rows={3}
          className="w-full resize-none rounded-xl border px-4 py-3 font-mono text-xs text-foreground/80 break-all outline-none"
          style={{ background: "var(--checkout-input)", borderColor: "var(--checkout-border-strong)" }}
        />
        <button
          type="button" onClick={copy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold text-background transition-all hover:translate-y-[-1px]"
          style={{ background: "var(--gradient-primary)" }}
        >
          {copied
            ? (<><CheckCircle2 className="size-4" /> Copiado!</>)
            : (<><Copy className="size-4" /> Copiar código Pix</>)}
        </button>
      </div>

      <div
        className="mt-5 flex items-start gap-2 rounded-xl border px-4 py-3 text-xs text-muted-foreground"
        style={{ borderColor: "var(--checkout-border)", background: "var(--checkout-surface-2)" }}
      >
        <Loader2 className="size-3.5 mt-0.5 animate-spin shrink-0" />
        <span>Aguardando confirmação do pagamento… esta página atualiza sozinha assim que o Pix for compensado.</span>
      </div>

      <ol className="mt-5 space-y-2 text-xs text-muted-foreground">
        <li><span className="text-foreground font-medium">1.</span> Abra o app do seu banco e acesse Pix.</li>
        <li><span className="text-foreground font-medium">2.</span> Escolha pagar por QR Code ou Pix copia e cola.</li>
        <li><span className="text-foreground font-medium">3.</span> Confirme o pagamento e volte aqui — entregamos automaticamente.</li>
      </ol>
    </div>
  );
}

/* -------- paid -------- */
function PaidScreen() {
  return (
    <div
      className="rounded-2xl border p-7 sm:p-10 text-center"
      style={{ background: "var(--checkout-surface)", borderColor: "var(--checkout-border)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-full" style={{ background: "var(--gradient-primary)" }}>
        <CheckCircle2 className="size-8 text-background" strokeWidth={2.4} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold text-foreground">Pagamento confirmado!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Recebemos seu pagamento. Em breve nosso time entra em contato pelo email cadastrado para iniciar o projeto.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-background"
        style={{ background: "var(--gradient-primary)" }}
      >
        Voltar ao site
      </Link>
    </div>
  );
}
