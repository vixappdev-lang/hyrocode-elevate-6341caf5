import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

export function FinalCTA() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="contato" className="relative py-28 sm:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 px-8 py-16 text-center shadow-[var(--shadow-elegant)] sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-60" />

          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
            Pronto para construir o próximo produto de referência?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Conte sobre o seu projeto. Em 24 horas respondemos com uma proposta inicial,
            escopo e cronograma.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:contato@hyrocode.com"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px]"
            >
              Iniciar projeto
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
            >
              Ver trabalhos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
