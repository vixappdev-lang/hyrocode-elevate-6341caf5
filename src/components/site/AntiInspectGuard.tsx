import { useEffect } from "react";

function isBlockedShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  return (
    event.key === "F12" ||
    (event.ctrlKey && event.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
    (event.metaKey && event.altKey && ["i", "j", "c", "k"].includes(key)) ||
    (event.ctrlKey && ["u", "s"].includes(key)) ||
    (event.metaKey && ["u", "s"].includes(key))
  );
}

export function AntiInspectGuard() {
  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isBlockedShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("contextmenu", prevent, { capture: true });
    document.addEventListener("dragstart", prevent, { capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", prevent, { capture: true });
      document.removeEventListener("dragstart", prevent, { capture: true });
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return null;
}