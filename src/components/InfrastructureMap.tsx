"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { Infrastructure } from "@/types/infrastructure";
import { t, Locale } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom markers by status
const createStatusIcon = (status: string) => {
  const color =
    status === "good" ? "blue" : status === "medium" ? "yellow" : "red";
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

interface InfrastructureMapProps {
  infrastructures: Infrastructure[];
  locale: Locale;
  height?: number;
}

export function InfrastructureMap({
  infrastructures,
  locale,
  height = 500,
}: InfrastructureMapProps) {
  const center: LatLngTuple = infrastructures.length
    ? [infrastructures[0].latitude, infrastructures[0].longitude]
    : [-4.441, 15.266]; // Kinshasa

  const getCapacityDisplay = (infra: Infrastructure) => {
    if (!infra.capacity) return "N/A";
    return `${infra.capacity} ${infra.capacityUnit === "m3" ? "m³" : "m²"}`;
  };

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {infrastructures.map((infra) => (
          <Marker
            key={infra.id}
            position={[infra.latitude, infra.longitude] as LatLngTuple}
            icon={createStatusIcon(infra.status)}
          >
            <Popup>
              <div className="text-sm min-w-50">
                <div className="font-semibold text-base mb-2">{infra.name}</div>
                <div className="space-y-1">
                  <div>
                    <strong>Type:</strong>{" "}
                    {t(`infrastructure.types.${infra.type}`, locale)}
                  </div>
                  <div>
                    <strong>État:</strong>
                    <span
                      className={`ml-1 px-2 py-1 rounded text-xs text-white ${
                        infra.status === "good"
                          ? "bg-blue-500"
                          : infra.status === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {t(`infrastructure.status.${infra.status}`, locale)}
                    </span>
                  </div>
                  <div>
                    <strong>Capacité:</strong> {getCapacityDisplay(infra)}
                  </div>
                  <div>
                    <strong>Commune:</strong> {infra.commune}
                  </div>
                  {infra.lastInspectionDate && (
                    <div>
                      <strong>Dernière vérification:</strong>{" "}
                      {new Date(infra.lastInspectionDate).toLocaleDateString()}
                    </div>
                  )}
                  {infra.fundingSource && (
                    <div>
                      <strong>Financement:</strong> {infra.fundingSource.name}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                    Voir détails
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
