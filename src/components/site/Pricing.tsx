import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { ContactModal } from "./ContactModal";

type Plan = {
  name: string;
  badge: string | null;
  price: string;
  installments: string | null;
  priceSuffix?: string | null;
  desc: string;
  features: string[];
  highlighted: boolean;
  cta: { type: "link" | "modal"; label: string; href?: string };
};

const plans: Plan[] = [
  {
    name: "Landing Page Premium",
    badge: null,
    price: "R$ 497",
    priceSuffix: "à vista",
    installments: "ou 12× de R$ 49,70",
    desc: "Ideal para profissionais e marcas que querem presença forte, autoridade e conversão alta.",
    features: [
      "Logotipo feito do zero",
      "Banners profissionais",
      "Design personalizado",
      "Estrutura responsiva",
      "SEO básico",
      "Conteúdo visual",
      "Configuração de domínio",
      "Garantia de desempenho",
      "2 rodadas completas de alterações",
      "Formulário de captura de leads (opcional)",
      "Estrutura 100% personalizada",
    ],
    highlighted: false,
    cta: {
      type: "link",
      label: "QUERO ESSE",
      href: "https://wa.me/?text=Quero%20a%20Landing%20Page%20Premium%20da%20HyroCode",
    },
  },
  {
    name: "Sistemas & Painéis Sob Medida",
    badge: "Mais escolhido",
    price: "Valor a consultar",
    priceSuffix: null,
    installments: null,
    desc: "Para software, painel administrativo, CRM, dashboards e automações desenvolvidas sob medida para o seu negócio.",
    features: [
      "Software sob medida",
      "Painel administrativo completo",
      "CRM personalizado",
      "Integrações com APIs",
      "Banco de dados robusto",
      "Login e controle de permissões",
      "Dashboard com métricas",
      "Escopo definido conforme sua necessidade",
    ],
    highlighted: true,
    cta: { type: "modal", label: "Entrar em contato" },
  },
];

export function Pricing() {
  const ref = useReveal<HTMLDivElement>();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="precos" className="relative py-28 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)", opacity: 0.5 }}
      />
      <div ref={ref} className="reveal mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
            Investimento
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
            Preço que cabe no bolso, resultado que impressiona.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Planos pensados para quem quer um produto digital de altíssimo nível
            sem pagar o preço de uma agência tradicional. Você investe uma vez e
            colhe por anos.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`group relative flex flex-col rounded-3xl border border-white/[0.08] bg-card/50 p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 ${
                p.highlighted
                  ? "bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)]"
                  : ""
              }`}
            >
              {p.highlighted && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: "var(--gradient-primary)",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "1.5px",
                  }}
                />
              )}
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-background">
                    <Sparkles className="size-3" />
                    {p.badge}
                  </span>
                </div>
              )}

              <h3 className="font-display text-xl font-semibold text-foreground">
                {p.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {p.price}
                </span>
                {p.priceSuffix && (
                  <span className="text-xs text-muted-foreground">{p.priceSuffix}</span>
                )}
              </div>
              {p.installments && (
                <div className="mt-1 text-sm text-muted-foreground">{p.installments}</div>
              )}

              <ul className="mt-7 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-glow">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {p.cta.type === "link" ? (
                <a
                  href={p.cta.href}
                  target="_blank"
                  rel="noopener"
                  className={`btn-shine mt-9 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all hover:translate-y-[-1px] ${
                    p.highlighted
                      ? "bg-foreground text-background shadow-[var(--shadow-elegant)]"
                      : "glass text-foreground hover:bg-white/[0.06]"
                  }`}
                >
                  {p.cta.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className={`btn-shine mt-9 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all hover:translate-y-[-1px] ${
                    p.highlighted
                      ? "bg-foreground text-background shadow-[var(--shadow-elegant)]"
                      : "glass text-foreground hover:bg-white/[0.06]"
                  }`}
                >
                  {p.cta.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <ContactModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
