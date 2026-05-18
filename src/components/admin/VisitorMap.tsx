import { useEffect, useRef, useState } from "react";

type Visitor = {
  id: string;
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  browser: string | null;
  is_vpn?: boolean | null;
};

/**
 * Fully client-only Leaflet map. We dynamically import leaflet inside an
 * effect so nothing touches `window` during SSR.
 */
export default function VisitorMap({ visitors }: { visitors: Visitor[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);
  const layerRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  // init once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default ?? (await import("leaflet"));
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      // @ts-expect-error runtime guard
      if (containerRef.current._leaflet_id) return;

      const map = L.map(containerRef.current, {
        center: [15, -10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 12,
        worldCopyJump: true,
        attributionControl: false,
        zoomControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        { subdomains: ["a", "b", "c", "d"], maxZoom: 19 },
      ).addTo(map);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
        { subdomains: ["a", "b", "c", "d"], maxZoom: 19, opacity: 0.55 },
      ).addTo(map);

      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      const map = mapRef.current as { remove?: () => void } | null;
      if (map?.remove) map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // refresh markers
  useEffect(() => {
    if (!ready) return;
    (async () => {
      const L = (await import("leaflet")).default ?? (await import("leaflet"));
      const layer = layerRef.current as {
        clearLayers: () => void;
        addLayer: (l: unknown) => void;
      } | null;
      if (!layer) return;
      layer.clearLayers();

      visitors.forEach((v) => {
        if (v.lat == null || v.lng == null) return;
        const color = v.is_vpn ? "#fbbf24" : "#22d3ee";
        const icon = L.divIcon({
          className: "",
          html: `
            <span style="
              position:relative;display:block;width:14px;height:14px;
              border-radius:9999px;background:${color};
              box-shadow:0 0 0 3px ${color}22, 0 0 12px ${color}aa;">
              <span style="
                position:absolute;inset:-6px;border-radius:9999px;
                border:1px solid ${color};opacity:.6;
                animation:hcPulse 2.2s ease-out infinite;"></span>
            </span>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const marker = L.marker([v.lat, v.lng], { icon }).bindTooltip(
          `<div style="font-size:11px;line-height:1.35">
             <strong style="color:#fff">${v.city ?? "?"}</strong>${v.country ? `, ${v.country}` : ""}
             <br/><span style="opacity:.7">${v.browser ?? ""}</span>
           </div>`,
          { direction: "top", offset: [0, -8], opacity: 1 },
        );
        layer.addLayer(marker);
      });
    })();
  }, [visitors, ready]);

  return (
    <>
      <style>{`
        @keyframes hcPulse {
          0% { transform: scale(.6); opacity: .9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .leaflet-container { background:#05070d !important; font-family: inherit; }
        .leaflet-control-zoom a {
          background:rgba(255,255,255,0.04) !important;
          color:#e5e7eb !important;
          border:1px solid rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(8px);
        }
        .leaflet-control-zoom a:hover { background:rgba(255,255,255,0.1) !important; }
        .leaflet-tooltip {
          background:rgba(10,12,18,.92) !important;
          color:#e5e7eb !important;
          border:1px solid rgba(255,255,255,.08) !important;
          border-radius:8px !important;
          box-shadow:0 10px 30px -10px rgba(0,0,0,.6) !important;
          padding:6px 9px !important;
        }
        .leaflet-tooltip-top:before { border-top-color: rgba(10,12,18,.92) !important; }
      `}</style>
      <div className="relative h-full w-full">
        {/* tech grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[400] opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[400]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)",
          }}
        />
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </>
  );
}
