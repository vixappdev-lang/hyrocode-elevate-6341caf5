import { Check, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const plans = [
  {
    name: "Landing Page Premium",
    badge: null as string | null,
    price: "R$ 497",
    installments: "ou 12× de R$ 49,70",
    desc: "Ideal para profissionais e marcas que querem presença forte e conversão alta.",
    features: [
      "Logotipo profissional incluso",
      "Design 100% personalizado",
      "Estrutura totalmente responsiva",
      "Animações premium",
      "SEO técnico otimizado",
      "Hospedagem orientada",
      "Entrega em até 7 dias",
    ],
    highlighted: false,
  },
  {
    name: "Painel / Sistema Web",
    badge: "Mais escolhido",
    price: "R$ 697",
    installments: "ou 12× de R$ 69,70",
    desc: "Para quem precisa de um sistema completo com painel administrativo e funcionalidades reais.",
    features: [
      "Tudo do plano Landing",
      "Painel administrativo completo",
      "Banco de dados integrado",
      "Login e área de usuário",
      "Dashboard com métricas",
      "Integrações sob medida",
      "Suporte por 30 dias",
    ],
    highlighted: true,
  },
];

export function Pricing() {
  const ref = useReveal<HTMLDivElement>();
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
              className={`relative flex flex-col rounded-3xl border p-8 sm:p-10 transition-all duration-500 ${
                p.highlighted
                  ? "border-transparent bg-card shadow-[var(--shadow-elegant)]"
                  : "border-white/[0.08] bg-card/50 hover:border-white/15"
              }`}
              style={
                p.highlighted
                  ? {
                      backgroundImage:
                        "linear-gradient(var(--card), var(--card)), var(--gradient-primary)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      border: "1.5px solid transparent",
                    }
                  : undefined
              }
            >
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
                <span className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                  {p.price}
                </span>
                <span className="text-xs text-muted-foreground">à vista</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{p.installments}</div>

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

              <a
                href="https://wa.me/?text=Quero%20esse%20plano%20da%20HyroCode"
                target="_blank"
                rel="noopener"
                className={`btn-shine mt-9 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all hover:translate-y-[-1px] ${
                  p.highlighted
                    ? "bg-foreground text-background shadow-[var(--shadow-elegant)]"
                    : "glass text-foreground hover:bg-white/[0.06]"
                }`}
              >
                QUERO ESSE
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
