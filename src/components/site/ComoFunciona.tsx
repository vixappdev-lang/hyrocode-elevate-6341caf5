import { MessageCircle, Lightbulb, Code2, CheckCircle2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const steps = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Consulta gratuita",
    desc: "Conversamos sem compromisso para entender sua ideia, público e objetivos. Você sai com clareza do próximo passo.",
  },
  {
    n: "02",
    icon: Lightbulb,
    title: "Alinhamento de ideias",
    desc: "Desenhamos a estratégia, definimos escopo, identidade e a melhor estrutura para o seu projeto vender de verdade.",
  },
  {
    n: "03",
    icon: Code2,
    title: "Desenvolvimento",
    desc: "Construímos com tecnologia de ponta, design premium e foco em performance. Tudo pensado para gerar resultado.",
  },
  {
    n: "04",
    icon: CheckCircle2,
    title: "Entrega & check final",
    desc: "Testamos, ajustamos e entregamos pronto para publicar. Você implementa sem dor de cabeça e começa a colher os frutos.",
  },
];

export function ComoFunciona() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="como-funciona" className="relative py-28 sm:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
            Como funciona
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
            Obtenha resultados surpreendentes em apenas 4 etapas simples.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Um processo claro, direto e sem enrolação. Entenda exatamente como
            transformamos sua ideia em um produto digital de alto padrão.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={n}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/60 p-7 transition-all duration-500 hover:border-white/15 hover:-translate-y-1"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-primary-glow">
                  <Icon className="size-5" />
                </div>
                <span
                  className="font-display text-3xl font-bold leading-none"
                  style={{
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    opacity: 0.85,
                  }}
                >
                  {n}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {desc}
              </p>

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(40% 60% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
