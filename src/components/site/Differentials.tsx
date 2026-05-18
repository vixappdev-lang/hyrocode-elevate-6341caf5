import {
  Gauge,
  Smartphone,
  Zap,
  Sparkles,
  Layers,
  Plug,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const items = [
  {
    icon: Gauge,
    title: "Alta Conversão",
    desc: "Cada decisão é guiada por dado e copy que vende. Interfaces que transformam visitas em receita.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    desc: "Projetado para tela pequena primeiro. Experiência impecável em qualquer dispositivo.",
  },
  {
    icon: Zap,
    title: "Performance",
    desc: "Carregamentos abaixo de um segundo, SSR moderno e Core Web Vitals no verde.",
  },
  {
    icon: Sparkles,
    title: "UX Premium",
    desc: "Tipografia, espaçamento e motion calibrados ao detalhe. A diferença está nos micro-momentos.",
  },
  {
    icon: Layers,
    title: "Sistemas Escaláveis",
    desc: "Arquitetura modular preparada para crescer com o seu produto sem reescrever do zero.",
  },
  {
    icon: Plug,
    title: "Integrações Inteligentes",
    desc: "Stripe, AI, CRMs, automações. Conectamos o que importa para o seu fluxo de trabalho.",
  },
];

export function Differentials() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="servicos" className="relative py-28 sm:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
            Diferenciais
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
            O padrão de um time sênior de produto.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Seis princípios que aplicamos em todo projeto, do primeiro wireframe ao deploy.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 p-7 transition-all duration-500 hover:border-white/15 hover:-translate-y-0.5"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-primary-glow">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(40% 60% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
