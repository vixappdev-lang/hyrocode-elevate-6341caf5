import { useEffect, useMemo, useRef } from "react";

type Visitor = {
  id: string;
  lat: number | null;
  lng: number | null;
  city: string | null;
  region?: string | null;
  country: string | null;
  browser: string | null;
  device?: string | null;
  is_vpn?: boolean | null;
  is_proxy?: boolean | null;
};

type LeafletModule = typeof import("leaflet");
type LeafletMap = ReturnType<LeafletModule["map"]>;
type LeafletLayerGroup = ReturnType<LeafletModule["layerGroup"]>;

function labelFor(v: Visitor) {
  return [v.city, v.region, v.country].filter(Boolean).join(", ") || "Localização detectada";
}

export default function VisitorMap({ visitors }: { visitors: Visitor[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletLayerGroup | null>(null);

  const points = useMemo(
    () =>
      visitors.filter(
        (v) =>
          typeof v.lat === "number" &&
          Number.isFinite(v.lat) &&
          typeof v.lng === "number" &&
          Number.isFinite(v.lng),
      ),
    [visitors],
  );

  useEffect(() => {
    let disposed = false;

    async function boot() {
      if (!containerRef.current || mapRef.current) return;
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (disposed || !containerRef.current) return;

      const L = leaflet.default ?? leaflet;
      const map = L.map(containerRef.current, {
        center: [-14.2, -51.9],
        zoom: 3,
        minZoom: 2,
        maxZoom: 12,
        maxBounds: [
          [-85, -180],
          [85, 180],
        ],
        maxBoundsViscosity: 0.7,
        worldCopyJump: true,
        attributionControl: false,
        zoomControl: false,
        preferCanvas: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
        opacity: 0.58,
      }).addTo(map);

      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setTimeout(() => map.invalidateSize(), 80);
    }

    boot();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let disposed = false;

    async function draw() {
      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;

      const leaflet = await import("leaflet");
      if (disposed) return;
      const L = leaflet.default ?? leaflet;
      layer.clearLayers();

      const bounds: [number, number][] = [];
      points.forEach((v, index) => {
        const lat = v.lat as number;
        const lng = v.lng as number;
        bounds.push([lat, lng]);
        const alert = Boolean(v.is_vpn || v.is_proxy);
        const markerClass = alert ? "visitor-marker visitor-marker-alert" : "visitor-marker";
        const icon = L.divIcon({
          className: "visitor-marker-shell",
          html: `<span class="${markerClass}" style="--delay:${(index % 7) * 0.18}s"></span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        L.marker([lat, lng], { icon, keyboard: false })
          .bindTooltip(
            `<strong>${labelFor(v)}</strong><br/><span>${v.device || "desktop"} · ${v.browser || "navegador"}</span>`,
            { direction: "top", offset: [0, -12], opacity: 1 },
          )
          .addTo(layer);

        L.circle([lat, lng], {
          radius: alert ? 105000 : 72000,
          stroke: true,
          weight: 1,
          color: alert ? "#f59e0b" : "#38bdf8",
          fillColor: alert ? "#f59e0b" : "#38bdf8",
          fillOpacity: 0.08,
          opacity: 0.28,
        }).addTo(layer);
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 5, { animate: true });
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [42, 42], maxZoom: 6, animate: true });
      }
    }

    const t = window.setTimeout(draw, 40);
    return () => {
      disposed = true;
      window.clearTimeout(t);
    };
  }, [points]);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-background">
      <style>{`
        @keyframes visitorPulse { 0% { transform: scale(.6); opacity: .9; } 100% { transform: scale(2.8); opacity: 0; } }
        @keyframes scanLine { 0% { transform: translateY(-100%); opacity: 0; } 20% { opacity: .7; } 100% { transform: translateY(100%); opacity: 0; } }
        .leaflet-container { height: 100%; width: 100%; background: var(--background); font-family: inherit; }
        .leaflet-tile { filter: saturate(.9) contrast(1.08); }
        .leaflet-control-zoom { border: 1px solid color-mix(in oklab, white 12%, transparent) !important; border-radius: 14px; overflow:hidden; box-shadow: var(--shadow-card); }
        .leaflet-control-zoom a { width: 34px !important; height: 34px !important; line-height: 32px !important; border: 0 !important; background: color-mix(in oklab, var(--card) 82%, transparent) !important; color: var(--foreground) !important; backdrop-filter: blur(18px); }
        .leaflet-control-zoom a:hover { background: color-mix(in oklab, var(--foreground) 10%, var(--card)) !important; }
        .leaflet-tooltip { background: color-mix(in oklab, var(--card) 92%, transparent) !important; color: var(--foreground) !important; border: 1px solid color-mix(in oklab, white 10%, transparent) !important; border-radius: 10px !important; box-shadow: var(--shadow-card) !important; padding: 8px 10px !important; font-size: 11px !important; line-height: 1.35 !important; backdrop-filter: blur(18px); }
        .leaflet-tooltip span { color: var(--muted-foreground); }
        .leaflet-tooltip-top:before { border-top-color: color-mix(in oklab, var(--card) 92%, transparent) !important; }
        .visitor-marker-shell { background: transparent; border: 0; }
        .visitor-marker { position: relative; display: block; width: 14px; height: 14px; border-radius: 999px; background: var(--primary-glow); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-glow) 20%, transparent), 0 0 22px color-mix(in oklab, var(--primary-glow) 80%, transparent); }
        .visitor-marker::before { content:""; position:absolute; inset:-8px; border-radius:999px; border:1px solid var(--primary-glow); animation: visitorPulse 2.4s ease-out infinite; animation-delay: var(--delay); }
        .visitor-marker-alert { background: oklch(0.78 0.15 78); box-shadow: 0 0 0 3px oklch(0.78 0.15 78 / .2), 0 0 22px oklch(0.78 0.15 78 / .8); }
        .visitor-marker-alert::before { border-color: oklch(0.78 0.15 78); }
      `}</style>
      <div ref={containerRef} className="absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[400] opacity-[0.13] [background-image:linear-gradient(color-mix(in_oklab,var(--primary-glow)_42%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--primary-glow)_42%,transparent)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[401] h-1/2 bg-gradient-to-b from-primary/10 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[402]"
        style={{ background: "radial-gradient(ellipse at center, transparent 46%, color-mix(in oklab, var(--background) 58%, transparent) 100%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[403] h-24 bg-gradient-to-b from-background/50 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[404] h-24 bg-gradient-to-b from-transparent via-primary/10 to-transparent" style={{ animation: "scanLine 5.5s linear infinite" }} />
      {points.length === 0 && (
        <div className="absolute inset-0 z-[405] grid place-items-center px-6 text-center">
          <div className="max-w-xs rounded-2xl border border-border bg-card/80 p-5 shadow-[var(--shadow-card)] backdrop-blur-xl">
            <p className="text-sm font-medium text-foreground">Aguardando visitas rastreadas</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              O mapa preenche automaticamente após o aceite de cookies e a primeira visita pública.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}