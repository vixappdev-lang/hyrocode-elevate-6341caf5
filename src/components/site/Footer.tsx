import logo from "@/assets/hyrocode-logo.png";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <img src={logo} alt="HyroCode" className="h-8 w-auto" draggable={false} />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Estúdio de produto digital. Projetamos sites, sistemas e plataformas SaaS
              que elevam marcas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-14">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70">
                Empresa
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#servicos" className="hover:text-foreground">Serviços</a></li>
                <li><a href="#processo" className="hover:text-foreground">Processo</a></li>
                <li><a href="#portfolio" className="hover:text-foreground">Portfólio</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70">
                Serviços
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#servicos" className="hover:text-foreground">Sites premium</a></li>
                <li><a href="#servicos" className="hover:text-foreground">Plataformas SaaS</a></li>
                <li><a href="#servicos" className="hover:text-foreground">Sistemas sob medida</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70">
                Contato
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li><a href="mailto:contato@hyrocode.com" className="hover:text-foreground">contato@hyrocode.com</a></li>
              </ul>
              <div className="mt-5 flex items-center gap-2">
                <a aria-label="LinkedIn" href="#" className="inline-flex size-9 items-center justify-center rounded-full glass text-muted-foreground transition-colors hover:text-foreground">
                  <Linkedin className="size-4" />
                </a>
                <a aria-label="GitHub" href="#" className="inline-flex size-9 items-center justify-center rounded-full glass text-muted-foreground transition-colors hover:text-foreground">
                  <Github className="size-4" />
                </a>
                <a aria-label="Twitter" href="#" className="inline-flex size-9 items-center justify-center rounded-full glass text-muted-foreground transition-colors hover:text-foreground">
                  <Twitter className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {year} HyroCode. Todos os direitos reservados.</p>
          <p>Feito com precisão · São Paulo · Global</p>
        </div>
      </div>
    </footer>
  );
}
