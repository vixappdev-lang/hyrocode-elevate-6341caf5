import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Visitor = {
  id: string;
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  browser: string | null;
};

export default function VisitorMap({ visitors }: { visitors: Visitor[] }) {
  useEffect(() => {
    // Fix default icon path issue (we don't use markers but just in case)
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  }, []);

  return (
    <MapContainer
      center={[10, -20]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      scrollWheelZoom
      style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
        maxZoom={19}
      />
      {visitors.map((v) => (
        <CircleMarker
          key={v.id}
          center={[v.lat as number, v.lng as number]}
          radius={5}
          pathOptions={{
            color: "#a78bfa",
            fillColor: "#a78bfa",
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -4]} opacity={1}>
            <div style={{ fontSize: 11 }}>
              <strong>{v.city || "?"}</strong>
              {v.country ? `, ${v.country}` : ""}
              <br />
              <span style={{ opacity: 0.7 }}>{v.browser || ""}</span>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
