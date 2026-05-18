import { useReveal } from "@/hooks/use-reveal";
import p1 from "@/assets/p1-analytics.jpg";
import p2 from "@/assets/p2-crm.jpg";
import p3 from "@/assets/p3-billing.jpg";
import p4 from "@/assets/p4-fintech.jpg";
import p5 from "@/assets/p5-projects.jpg";
import p6 from "@/assets/p6-ecom.jpg";

type Project = {
  img: string;
  name: string;
  category: string;
};

const projects: Project[] = [
  { img: p1, name: "Sorriso Bem Estar", category: "Clínica Odontológica" },
  { img: p2, name: "Barbearia Don Lucca", category: "Barbearia" },
  { img: p3, name: "Lumière Estética", category: "Estética & Beleza" },
  { img: p4, name: "Core Pilates Studio", category: "Studio de Pilates" },
  { img: p5, name: "Almeida & Ribeiro", category: "Advocacia" },
  { img: p6, name: "Cantina Bella Massa", category: "Restaurante" },
];

export function PortfolioSlider() {
  const ref = useReveal<HTMLDivElement>();
  const loop = [...projects, ...projects];

  return (
    <section id="portfolio" className="relative py-24 sm:py-28">
      <div ref={ref} className="reveal mx-auto max-w-3xl px-6 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
          Portfólio
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
          Projetos reais entregues.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Confira alguns dos últimos projetos desenvolvidos pela HyroCode.
          Sites pensados para vender, agendar e gerar autoridade para o seu negócio.
        </p>
      </div>

      <div className="relative mt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />

        <div className="flex w-max gap-6 sm:gap-8 marquee-track">
          {loop.map((p, i) => (
            <article
              key={`${p.name}-${i}`}
              className="group/card relative h-[300px] w-[380px] shrink-0 overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 sm:h-[360px] sm:w-[500px]"
            >
              <img
                src={p.img}
                alt={`${p.name}, ${p.category}`}
                width={1280}
                height={896}
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-center transition-transform duration-[1.4s] ease-out group-hover/card:scale-[1.03]"
              />
              {/* Soft bottom gradient for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

              {/* Glow halo on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
                }}
              />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-glow">
                  {p.category}
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground sm:text-xl">
                  {p.name}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
