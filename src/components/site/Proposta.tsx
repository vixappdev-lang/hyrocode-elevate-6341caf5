import { useReveal } from "@/hooks/use-reveal";

export function Proposta() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="proposta" className="relative py-28 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)", opacity: 0.6 }}
      />
      <div ref={ref} className="reveal mx-auto max-w-4xl px-6 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
          Nossa proposta
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-6xl">
          Transformamos ideias em produtos digitais que realmente vendem.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A HyroCode não entrega apenas um site. Entregamos uma máquina de
          autoridade, posicionamento e conversão. Cada pixel é pensado para
          gerar confiança, cada animação para gerar desejo e cada palavra para
          gerar ação. Se o seu negócio merece um patamar acima, é exatamente isso
          que construímos para você.
        </p>
      </div>
    </section>
  );
}
