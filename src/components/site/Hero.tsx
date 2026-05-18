import { ArrowRight, Sparkles, TrendingUp, Gauge } from "lucide-react";

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

        {/* Composição premium: browser mockup central + 2 cards flutuantes */}
        <div className="relative mx-auto mt-24 h-[440px] w-full max-w-4xl sm:h-[500px]">
          {/* Glow ambient */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Browser mockup central */}
          <div
            className="absolute left-1/2 top-1/2 w-[88%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-card shadow-[var(--shadow-elegant)]"
            style={{ animation: "float-y 6s ease-in-out infinite" }}
          >
            {/* Browser top bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-background/60 px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-yellow-400/70" />
              <span className="size-2.5 rounded-full bg-green-400/70" />
              <div className="ml-3 hidden h-5 flex-1 items-center rounded-md bg-white/[0.04] px-3 text-[10px] text-muted-foreground sm:flex">
                hyrocode.com.br
              </div>
            </div>

            {/* Browser content */}
            <div className="relative grid grid-cols-12 gap-4 p-5 sm:p-7">
              {/* Left: copy + bars */}
              <div className="col-span-12 sm:col-span-7">
                <div className="h-2.5 w-24 rounded-full bg-primary/40" />
                <div className="mt-3 h-5 w-[80%] rounded-md bg-white/15" />
                <div className="mt-2 h-5 w-[60%] rounded-md bg-white/10" />
                <div className="mt-5 space-y-2">
                  <div className="h-2 w-full rounded bg-white/[0.06]" />
                  <div className="h-2 w-[92%] rounded bg-white/[0.06]" />
                  <div className="h-2 w-[78%] rounded bg-white/[0.06]" />
                </div>
                <div className="mt-6 flex gap-2">
                  <div
                    className="h-8 w-28 rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                  <div className="h-8 w-24 rounded-full border border-white/15" />
                </div>
              </div>

              {/* Right: stylized chart */}
              <div className="col-span-12 sm:col-span-5">
                <div className="rounded-xl border border-white/[0.08] bg-background/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-16 rounded bg-white/15" />
                    <div className="h-2 w-8 rounded bg-primary/60" />
                  </div>
                  <svg
                    viewBox="0 0 200 90"
                    className="mt-3 h-24 w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.66 0.16 250)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="oklch(0.66 0.16 250)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,70 L25,60 L50,65 L75,45 L100,50 L125,30 L150,35 L175,18 L200,22 L200,90 L0,90 Z"
                      fill="url(#ga)"
                    />
                    <path
                      d="M0,70 L25,60 L50,65 L75,45 L100,50 L125,30 L150,35 L175,18 L200,22"
                      fill="none"
                      stroke="oklch(0.78 0.14 240)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-md bg-white/[0.04] p-2">
                      <div className="h-1.5 w-6 rounded bg-white/15" />
                      <div className="mt-1 h-2.5 w-10 rounded bg-white/30" />
                    </div>
                    <div className="rounded-md bg-white/[0.04] p-2">
                      <div className="h-1.5 w-6 rounded bg-white/15" />
                      <div className="mt-1 h-2.5 w-10 rounded bg-white/30" />
                    </div>
                    <div className="rounded-md bg-white/[0.04] p-2">
                      <div className="h-1.5 w-6 rounded bg-white/15" />
                      <div className="mt-1 h-2.5 w-10 rounded bg-white/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating card top-left: conversion */}
          <div
            className="absolute left-2 top-6 hidden w-[210px] rounded-2xl border border-white/[0.08] bg-card/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-xl sm:block"
            style={{ animation: "float-y 5s ease-in-out infinite", animationDelay: "-1.5s", transform: "rotate(-4deg)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Conversão
                </div>
                <div className="font-display text-lg font-semibold text-foreground">
                  +218%
                </div>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full w-[82%] rounded-full"
                style={{ background: "var(--gradient-primary)" }}
              />
            </div>
          </div>

          {/* Floating card bottom-right: performance */}
          <div
            className="absolute bottom-4 right-2 hidden w-[210px] rounded-2xl border border-white/[0.08] bg-card/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-xl sm:block"
            style={{ animation: "float-y 5.5s ease-in-out infinite", animationDelay: "-2.8s", transform: "rotate(3.5deg)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
                <Gauge className="size-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Performance
                </div>
                <div className="font-display text-lg font-semibold text-foreground">
                  98 / 100
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-emerald-400/70" />
              <span className="h-1.5 flex-1 rounded-full bg-emerald-400/70" />
              <span className="h-1.5 flex-1 rounded-full bg-emerald-400/70" />
              <span className="h-1.5 flex-1 rounded-full bg-emerald-400/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
