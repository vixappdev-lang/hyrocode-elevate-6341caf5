import { useReveal } from "@/hooks/use-reveal";
import p1 from "@/assets/p1-analytics.jpg";
import p2 from "@/assets/p2-crm.jpg";
import p3 from "@/assets/p3-billing.jpg";
import p4 from "@/assets/p4-fintech.jpg";
import p5 from "@/assets/p5-projects.jpg";
import p6 from "@/assets/p6-ecom.jpg";
import p7 from "@/assets/p7-health.jpg";
import p8 from "@/assets/p8-landing.jpg";

type Project = {
  img: string;
  name: string;
  category: string;
  tags: string[];
};

const projects: Project[] = [
  { img: p1, name: "Northwind Analytics", category: "SaaS · Data", tags: ["Dashboard", "Charts"] },
  { img: p2, name: "Momentum CRM", category: "B2B · Vendas", tags: ["Pipeline", "Workflow"] },
  { img: p3, name: "BillFlow", category: "Fintech · Billing", tags: ["Stripe", "Invoices"] },
  { img: p4, name: "Vault Banking", category: "Mobile · Fintech", tags: ["iOS", "Wallet"] },
  { img: p5, name: "Sprintly", category: "Produto · PM", tags: ["Timeline", "Teams"] },
  { img: p6, name: "Luxora Commerce", category: "E-commerce · Admin", tags: ["Orders", "Catalog"] },
  { img: p7, name: "MediTrack", category: "Healthcare · Saúde", tags: ["EHR", "Care"] },
  { img: p8, name: "Aurora Landing", category: "Site · Marketing", tags: ["Brand", "SSR"] },
];

export function PortfolioSlider() {
  const ref = useReveal<HTMLDivElement>();
  const loop = [...projects, ...projects];

  return (
    <section id="portfolio" className="relative py-28 sm:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/90">
              Portfólio
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl">
              Produtos reais. Padrão de classe mundial.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Uma seleção de plataformas, dashboards e apps que projetamos para empresas que
            competem em produto.
          </p>
        </div>
      </div>

      <div className="group relative mt-14 overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />

        <div
          className="flex w-max gap-5 sm:gap-6"
          style={{
            animation: "marquee 60s linear infinite",
          }}
        >
          {loop.map((p, i) => (
            <article
              key={`${p.name}-${i}`}
              className="group/card relative h-[420px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-card shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:border-white/15 sm:h-[480px] sm:w-[320px]"
            >
              <img
                src={p.img}
                alt={`${p.name} — ${p.category}`}
                width={896}
                height={1184}
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-top transition-transform duration-[1.4s] ease-out group-hover/card:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-primary-glow">
                  {p.category}
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground">
                  {p.name}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <style>{`
          .group:hover > div[style*="marquee"] { animation-play-state: paused; }
        `}</style>
      </div>
    </section>
  );
}
