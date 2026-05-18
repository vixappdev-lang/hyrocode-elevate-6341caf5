import { ArrowRight, Sparkles, Code2, Zap, Layers } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-28">
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
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="size-3 text-primary-glow" />
            Bem-vindo à HyroCode
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-gradient sm:text-5xl md:text-6xl lg:text-7xl">
            Seu negócio merece um site que vende por você.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Uma nova proposta de site para você que está com baixa conversão.
            Adquira hoje mesmo sua landing page ou site institucional com
            tecnologias de alta conversão e design pensado para gerar resultado real.
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
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
            >
              Ver portfólio
            </a>
          </div>
        </div>

        {/* Animated orb visual */}
        <div className="relative mx-auto mt-24 flex h-[420px] w-full max-w-3xl items-center justify-center sm:h-[480px]">
          {/* Glow */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 mx-auto h-full w-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
              filter: "blur(10px)",
            }}
          />

          {/* Outer ring */}
          <div
            className="absolute h-[420px] w-[420px] rounded-full border border-white/[0.08] sm:h-[460px] sm:w-[460px]"
            style={{ animation: "orb-spin 28s linear infinite" }}
          >
            <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-primary-glow shadow-[0_0_24px_8px_color-mix(in_oklab,var(--primary-glow)_70%,transparent)]" />
          </div>

          {/* Middle ring */}
          <div
            className="absolute h-[320px] w-[320px] rounded-full border border-white/[0.10] sm:h-[360px] sm:w-[360px]"
            style={{ animation: "orb-spin-reverse 22s linear infinite" }}
          >
            <span className="absolute top-1/2 -right-1 size-2.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_6px_color-mix(in_oklab,var(--primary)_70%,transparent)]" />
            <span className="absolute bottom-2 left-6 size-1.5 rounded-full bg-white/70" />
          </div>

          {/* Inner ring with floating chips */}
          <div
            className="absolute h-[220px] w-[220px] rounded-full border border-white/[0.12] sm:h-[260px] sm:w-[260px]"
            style={{ animation: "orb-spin 16s linear infinite" }}
          >
            <span className="absolute -top-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_16px_4px_rgb(255,255,255,0.5)]" />
          </div>

          {/* Floating chips counter-rotating to stay upright */}
          <div
            className="absolute h-[420px] w-[420px] sm:h-[460px] sm:w-[460px]"
            style={{ animation: "orb-spin 28s linear infinite" }}
          >
            <div
              className="absolute -left-2 top-1/2 -translate-y-1/2 sm:-left-6"
              style={{ animation: "orb-spin-reverse 28s linear infinite" }}
            >
              <div className="flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-foreground/90 shadow-[var(--shadow-glass)]">
                <Code2 className="size-3.5 text-primary-glow" /> Código limpo
              </div>
            </div>
            <div
              className="absolute -right-2 top-8 sm:-right-6"
              style={{ animation: "orb-spin-reverse 28s linear infinite" }}
            >
              <div className="flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-foreground/90 shadow-[var(--shadow-glass)]">
                <Zap className="size-3.5 text-primary-glow" /> Performance
              </div>
            </div>
            <div
              className="absolute bottom-4 left-10 sm:left-16"
              style={{ animation: "orb-spin-reverse 28s linear infinite" }}
            >
              <div className="flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-foreground/90 shadow-[var(--shadow-glass)]">
                <Layers className="size-3.5 text-primary-glow" /> Design premium
              </div>
            </div>
          </div>

          {/* Core orb */}
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full sm:h-52 sm:w-52">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "var(--gradient-primary)",
                filter: "blur(28px)",
                opacity: 0.7,
                animation: "orb-pulse 4s ease-in-out infinite",
              }}
            />
            <div
              className="relative h-32 w-32 rounded-full border border-white/20 sm:h-36 sm:w-36"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.6), transparent 45%), var(--gradient-primary)",
                boxShadow:
                  "inset 0 -20px 40px rgba(0,0,0,0.45), 0 30px 80px -10px color-mix(in oklab, var(--primary) 60%, transparent)",
                animation: "orb-pulse 4s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
