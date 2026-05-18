import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/hyrocode-logo.png";

const links = [
  { href: "#proposta", label: "Proposta" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full pl-3 pr-2 py-1 sm:pl-4 sm:pr-3 sm:py-1 transition-all duration-500 ${
          scrolled
            ? "glass shadow-[var(--shadow-glass)]"
            : "border border-transparent bg-transparent"
        }`}
        aria-label="Principal"
      >
        <a href="#top" className="flex items-center -my-2">
          <img
            src={logo}
            alt="HyroCode"
            className="h-20 w-auto sm:h-24 select-none"
            draggable={false}
          />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#precos"
            className="btn-shine hidden md:inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            Iniciar projeto
            <ArrowRight className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="inline-flex md:hidden size-10 items-center justify-center rounded-full glass"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 top-0 z-40 md:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
          onClick={() => setOpen(false)}
        />
        <div className="relative mx-4 mt-24 rounded-3xl glass p-6 shadow-[var(--shadow-glass)]">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base text-foreground/90 transition-colors hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#precos"
            onClick={() => setOpen(false)}
            className="btn-shine mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background"
          >
            Iniciar projeto
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
