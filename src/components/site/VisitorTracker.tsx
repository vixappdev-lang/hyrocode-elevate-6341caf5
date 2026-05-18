import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function VisitorTracker() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const hasCookie = document.cookie.split(";").some((c) => c.trim().startsWith("hc_consent=accepted"));
    const hasLocal = localStorage.getItem("hc_consent") === "accepted";
    const has = hasCookie || hasLocal;
    if (!has) return;
    fetch("/api/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || "",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [path]);
  return null;
}
