import { useReveal } from "@/hooks/use-reveal";
import { ArrowRight } from "lucide-react";
import valoresImg from "@/assets/valores-workspace.jpg";

const cards = [
  {
    eyebrow: "Nossa visão",
    title: "Elevar sempre o valor da sua empresa em sites.",
    text: "Sites e landing pages profissionais que mostram exatamente o que seu cliente precisa ver para confiar e converter.",
  },
  {
    eyebrow: "Nossa missão",
    title: "Uma parceria pensando no longo prazo.",
    text: "Priorizamos o suporte ao cliente para garantir uma experiência única antes, durante e depois do lançamento.",
  },
];

export function Valores() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="valores" className="relative py-20 sm:py-24 lg:py-28">
      <div
        ref={ref}
        className="reveal mx-auto grid max-w-7xl gap-5 px-6 lg:grid-cols-3 lg:gap-6"
      >
        {/* Card grande — Nossos Valores */}
        <article className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-card shadow-[var(--shadow-card)] lg:col-span-2 lg:min-h-[460px]">
          <img
            src={valoresImg}
            alt="Workspace da HyroCode"
            width={1280}
            height={896}
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-55 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/92 to-background/55" />

          <div className="relative flex h-full min-h-[380px] flex-col justify-end p-7 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-3.5 w-[2px] rounded-full bg-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Nossos valores
              </span>
            </div>
            <h3 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-[30px]">
              Designs inteligentes e resultados precisos para sua marca digital.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Conectamos sua empresa aos seus clientes através de sites que
              elevam a conversão a níveis extremos.
            </p>
            <a
              href="#proposta"
              className="btn-shine mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
            >
              Saber mais
              <ArrowRight className="size-4" />
            </a>
          </div>
        </article>

        {/* Coluna direita: Visão + Missão */}
        <div className="grid gap-5 lg:gap-6">
          {cards.map((c) => (
            <article
              key={c.eyebrow}
              className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-white/[0.07] bg-card p-7 shadow-[var(--shadow-card)] sm:p-8 lg:min-h-[222px]"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.04), var(--shadow-card)",
              }}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-3 w-[2px] rounded-full bg-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  {c.eyebrow}
                </span>
              </div>
              <h4 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground sm:text-[22px]">
                {c.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
