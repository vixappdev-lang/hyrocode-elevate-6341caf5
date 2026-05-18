import { ArrowRight, Sparkles } from "lucide-react";
import heroSite from "@/assets/hero-site.jpg";
import heroDashboard from "@/assets/hero-dashboard-v2.jpg";
import heroMobile from "@/assets/hero-mobile.jpg";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-24">
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
            <Sparkles className="size-3 text-primary-glow" />
            Estúdio premium de produto digital
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-gradient sm:text-5xl md:text-6xl lg:text-7xl">
            Sites, sistemas e experiências digitais que elevam marcas.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Projetamos plataformas SaaS, sites premium e sistemas sob medida para
            empresas que tratam produto como vantagem competitiva.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#precos"
              className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px]"
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

        {/* Visual mosaic */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div
            aria-hidden
            className="absolute inset-x-10 -top-10 -z-10 h-64 rounded-full blur-3xl"
            style={{ background: "var(--gradient-primary)", opacity: 0.35 }}
          />

          <div className="relative grid grid-cols-12 gap-4 sm:gap-6">
            {/* Big site preview */}
            <div className="col-span-12 sm:col-span-8 relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[var(--shadow-elegant)] rotate-[-1.5deg] transition-transform duration-700 hover:rotate-0">
                <img
                  src={heroSite}
                  alt="Preview de site premium"
                  width={1280}
                  height={800}
                  className="block w-full"
                />
              </div>
            </div>

            {/* Mobile mockup */}
            <div className="col-span-6 sm:col-span-4 relative sm:translate-y-8">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[var(--shadow-elegant)] rotate-[3deg] transition-transform duration-700 hover:rotate-0">
                <img
                  src={heroMobile}
                  alt="App mobile premium"
                  width={640}
                  height={1280}
                  className="block w-full"
                />
              </div>
            </div>

            {/* Dashboard floating */}
            <div className="col-span-6 sm:col-span-7 sm:col-start-3 relative -translate-y-6 sm:-translate-y-10">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[var(--shadow-elegant)] rotate-[1.5deg] transition-transform duration-700 hover:rotate-0">
                <img
                  src={heroDashboard}
                  alt="Painel SaaS premium"
                  width={1280}
                  height={800}
                  className="block w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
