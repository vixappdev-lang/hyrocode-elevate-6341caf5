import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "hc_consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookie = document.cookie.split(";").find((c) => c.trim().startsWith(`${KEY}=`));
    const ls = localStorage.getItem(KEY);
    if (!cookie && !ls) setOpen(true);
  }, []);

  const decide = (v: "accepted" | "rejected") => {
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${KEY}=${v}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* noop */
    }
    setOpen(false);
    if (v === "accepted") {
      // Fire a tracking ping right after acceptance
      fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-hc-consent": "accepted" },
        body: JSON.stringify({
          path: window.location.pathname,
          referrer: document.referrer || "",
        }),
        keepalive: true,
      }).catch(() => {});
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-2 bottom-2 z-[60] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md"
    >
      <div className="glass rounded-2xl border border-white/10 bg-card/90 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">Cookies & privacidade</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Usamos cookies para entender como você navega e melhorar a experiência. Você decide.
            </p>
          </div>
          <button
            onClick={() => decide("rejected")}
            aria-label="Fechar"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            onClick={() => decide("rejected")}
            className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/5"
          >
            Rejeitar
          </button>
          <button
            onClick={() => decide("accepted")}
            className="flex-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
