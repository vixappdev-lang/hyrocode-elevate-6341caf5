import { useReveal } from "@/hooks/use-reveal";

const steps = [
  {
    n: "01",
    title: "Estratégia",
    desc: "Imersão no negócio, objetivos e métricas. Definimos escopo, prioridades e KPIs.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Arquitetura de informação, design system e protótipos navegáveis de alta fidelidade.",
  },
  {
    n: "03",
    title: "Desenvolvimento",
    desc: "Engenharia limpa, performance e qualidade. Stack moderna, código preparado para escalar.",
  },
  {
    n: "04",
    title: "Entrega",
    desc: "Deploy, observabilidade e handoff. Acompanhamento contínuo para iterar com confiança.",
  },
];

export function Process() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="processo" className="relative py-28 sm:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
            Processo
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
            Um fluxo claro, do briefing à entrega.
          </h2>
        </div>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block"
          />
          <ol className="grid gap-6 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="relative">
                <div className="relative z-10 mx-auto flex size-16 items-center justify-center rounded-full glass shadow-[var(--shadow-glass)]">
                  <span className="font-display text-sm font-semibold text-primary-glow">
                    {s.n}
                  </span>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
