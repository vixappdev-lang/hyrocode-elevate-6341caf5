import logo from "@/assets/hyrocode-logo.png";
import { Instagram } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <img
          src={logo}
          alt="HyroCode"
          className="mx-auto h-24 w-auto sm:h-28"
          draggable={false}
        />

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          A HyroCode cria soluções digitais personalizadas, modernas e funcionais
          para destacar o seu negócio online — sites, sistemas e experiências que
          realmente convertem.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <a
            aria-label="Instagram"
            href="https://instagram.com/"
            target="_blank"
            rel="noopener"
            className="inline-flex size-11 items-center justify-center rounded-full glass text-muted-foreground transition-all hover:text-foreground hover:scale-105"
          >
            <Instagram className="size-5" />
          </a>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground">
          Feito com carinho por <span className="text-foreground">HyroCode Desenvolvimento</span> · © {year}
        </div>
      </div>
    </footer>
  );
}
