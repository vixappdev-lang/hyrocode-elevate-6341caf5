import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Proposta } from "@/components/site/Proposta";
import { Valores } from "@/components/site/Valores";
import { PortfolioSlider } from "@/components/site/PortfolioSlider";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HyroCode | Sites, sistemas e experiências digitais premium" },
      {
        name: "description",
        content:
          "HYROCODE cria soluções personalizadas, modernas e funcionais para destacar seu negócio online. Transformamos sua ideia em sucesso digital!",
      },
      { property: "og:title", content: "HyroCode | Estúdio de produto digital" },
      {
        property: "og:description",
        content:
          "HYROCODE cria soluções personalizadas, modernas e funcionais para destacar seu negócio online. Transformamos sua ideia em sucesso digital!",
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
      <Proposta />
      <Valores />
      <PortfolioSlider />
      <ComoFunciona />
      <Pricing />
      <Footer />
    </main>
  );
}
