import logo from "@/assets/hyrocode-logo.png";
import { Instagram } from "lucide-react";

const navegacao = [
  { href: "#top", label: "Início" },
  { href: "#portfolio", label: "Projetos" },
  { href: "#proposta", label: "Serviços" },
  { href: "#como-funciona", label: "Processo" },
  { href: "#precos", label: "Contato" },
];

const solucoes = [
  { href: "#precos", label: "Sites Premium" },
  { href: "#precos", label: "Sistemas Web" },
  { href: "#precos", label: "SaaS" },
  { href: "#precos", label: "Dashboards" },
  { href: "#precos", label: "Automação" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative">
      {/* Linha divisória premium suave com glow discreto */}
      <div aria-hidden className="relative h-px w-full">
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />
        <div className="absolute left-1/2 top-0 h-px w-[50%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Marca */}
          <div className="md:col-span-5">
            <img
              src={logo}
              alt="HyroCode"
              className="h-16 md:h-20 w-auto -ml-2 select-none"
              draggable={false}
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Estúdio digital especializado em sites premium, sistemas web e
              experiências de alta conversão.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                aria-label="Instagram HyroCode"
                href="https://instagram.com/hyrocode"
                target="_blank"
                rel="noopener"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.06] text-muted-foreground transition-all duration-200 hover:border-white/15 hover:text-foreground"
              >
                <Instagram className="size-[16px]" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/90">
              Navegação
            </h3>
            <ul className="mt-5 space-y-3">
              {navegacao.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluções */}
          <div className="md:col-span-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/90">
              Soluções
            </h3>
            <ul className="mt-5 space-y-3">
              {solucoes.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year}{" "}
            <span className="text-foreground">HyroCode Desenvolvimento</span>.
            Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Política de privacidade
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
