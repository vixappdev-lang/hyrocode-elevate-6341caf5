import { ArrowRight } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 sm:pt-40 lg:pt-48 pb-24">
      {/* Background layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            Estúdio de produto digital
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-gradient sm:text-5xl md:text-6xl lg:text-7xl">
            Sites, sistemas e experiências digitais que elevam marcas.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Projetamos plataformas SaaS, interfaces modernas e automações sob medida para
            empresas que tratam produto como vantagem competitiva.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contato"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px]"
            >
              Iniciar um projeto
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
            >
              Ver portfólio
            </a>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <div
            aria-hidden
            className="absolute inset-x-10 -top-10 -z-10 h-40 rounded-full blur-3xl"
            style={{ background: "var(--gradient-primary)", opacity: 0.35 }}
          />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 shadow-[var(--shadow-elegant)]">
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-xs text-muted-foreground">app.hyrocode.com</span>
            </div>
            <img
              src={heroDashboard}
              alt="Painel premium HyroCode mostrando métricas de produto"
              width={1536}
              height={1024}
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
