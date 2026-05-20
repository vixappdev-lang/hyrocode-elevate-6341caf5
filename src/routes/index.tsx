import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Proposta } from "@/components/site/Proposta";
import { Valores } from "@/components/site/Valores";
import { PortfolioSlider } from "@/components/site/PortfolioSlider";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";

const DESC =
  "HYROCODE cria soluções personalizadas, modernas e funcionais para destacar seu negócio online. Transformamos sua ideia em sucesso digital!";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HyroCode | Sites, sistemas e experiências digitais premium" },
      { name: "description", content: DESC },
      { property: "og:title", content: "HyroCode | Sites, sistemas e experiências digitais premium" },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "https://www.hyrocode.online/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.hyrocode.online/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "HyroCode",
          url: "https://www.hyrocode.online",
          inLanguage: "pt-BR",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.hyrocode.online/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "HyroCode",
          image: "https://www.hyrocode.online/favicon.png",
          url: "https://www.hyrocode.online",
          description: DESC,
          priceRange: "R$ 497 - sob consulta",
          areaServed: { "@type": "Country", name: "Brasil" },
          serviceType: [
            "Criação de sites",
            "Landing pages",
            "Sistemas web sob medida",
            "Dashboards e painéis administrativos",
            "Automação de processos",
          ],
        }),
      },
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
