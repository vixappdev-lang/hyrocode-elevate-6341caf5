import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { PortfolioSlider } from "@/components/site/PortfolioSlider";
import { Differentials } from "@/components/site/Differentials";
import { Process } from "@/components/site/Process";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HyroCode — Sites, sistemas e experiências digitais premium" },
      {
        name: "description",
        content:
          "Estúdio de produto digital. Projetamos sites premium, plataformas SaaS, sistemas sob medida e interfaces modernas que elevam marcas.",
      },
      { property: "og:title", content: "HyroCode — Estúdio de produto digital" },
      {
        property: "og:description",
        content:
          "Sites premium, plataformas SaaS e sistemas sob medida com padrão de classe mundial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <PortfolioSlider />
      <Differentials />
      <Process />
      <FinalCTA />
      <Footer />
    </main>
  );
}
