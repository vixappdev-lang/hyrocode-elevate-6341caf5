import logo from "@/assets/hyrocode-logo.png";
import { Instagram } from "lucide-react";

const suporte = [
  { href: "#proposta", label: "Central de ajuda" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Contato" },
];

const empresa = [
  { href: "#top", label: "Início" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#proposta", label: "Proposta" },
  { href: "#precos", label: "Preços" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {/* Coluna 1 — marca */}
          <div>
            <img
              src={logo}
              alt="HyroCode"
              className="h-20 w-auto md:h-24"
              draggable={false}
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A HyroCode cria soluções digitais personalizadas, modernas e
              funcionais para destacar o seu negócio online. Sites e
              experiências que realmente convertem.
            </p>
            <a
              aria-label="Instagram HyroCode"
              href="https://instagram.com/"
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex size-11 items-center justify-center rounded-full glass text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
            >
              <Instagram className="size-5" />
            </a>
          </div>

          {/* Coluna 2 — Suporte */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              Suporte
            </h3>
            <ul className="mt-5 space-y-3">
              {suporte.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Empresa */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              Empresa
            </h3>
            <ul className="mt-5 space-y-3">
              {empresa.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.06] pt-6 text-center text-xs text-muted-foreground">
          Feito com carinho por{" "}
          <span className="text-foreground">HyroCode Desenvolvimento</span> · ©{" "}
          {year}
        </div>
      </div>
    </footer>
  );
}
