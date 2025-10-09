"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type LatLngTuple } from "leaflet";
import { Well } from "@/types/well";
// Exemple à placer dans ton composant parent


// Fix default marker icons path in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function WellsMap({
  wells,
  height = 520,
}: {
  wells: Well[];
  height?: number;
}) {
  const center: LatLngTuple = wells.length
    ? [wells[0].latitude, wells[0].longitude]
    : [-4.441, 15.266]; // Kinshasa approx

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {wells.map((w) => (
          <Marker
            key={w.id}
            position={[w.latitude, w.longitude] as LatLngTuple}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">
                  {w.lastName} {w.firstName}
                </div>
                <div>{w.commune}</div>
                <div>Capacité: {w.capacityLiters ?? "n/d"} L</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
