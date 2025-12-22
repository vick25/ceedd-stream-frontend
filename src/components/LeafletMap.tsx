// src/components/LeafletMap.tsx

"use client";

import { MapFeature } from "@/types/types";
import { displayDate } from "@/utils/utils";
import { Icon } from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
// Dynamically import MarkerClusterGroup to prevent SSR issues
const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-markercluster").then((mod) => mod.default),
  { ssr: false }
) as unknown as React.ComponentType<React.PropsWithChildren<any>>;

interface LeafletMapProps {
  features: MapFeature[];
  onFeatureClick: (feature: MapFeature) => void;
  selectedFeatureId?: string;
  mapStyle: "standard" | "satellite";
}

// 1. Définition de l'icône de l'usine (à l'extérieur du composant pour la performance)
const customIcon = new Icon({
  iconUrl: "/iconImage.png",
  iconSize: [64, 64],
  iconAnchor: [40, 64],
  popupAnchor: [0, -64],
});

// Component to handle map centering when a feature is selected
const MapUpdater: React.FC<{ selectedFeature?: MapFeature }> = ({
  selectedFeature,
}) => {
  const map = useMap();
  useEffect(() => {
    if (selectedFeature) {
      map.flyTo([selectedFeature.lat, selectedFeature.lng], 15, {
        duration: 1.5,
      });
    }
  }, [selectedFeature, map]);
  return null;
};

// Component to handle Ctrl + Scroll to Zoom (inchangé)
const CtrlZoomHandler: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.disable();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        map.scrollWheelZoom.enable();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        map.scrollWheelZoom.disable();
      }
    };

    const handleBlur = () => {
      map.scrollWheelZoom.disable();
    };

    const onVisibility = () => {
      if (document.hidden) map.scrollWheelZoom.disable();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [map]);

  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  features,
  onFeatureClick,
  selectedFeatureId,
  mapStyle,
}) => {
  // Center of Congo / Central Africa
  const center: [number, number] = [-2.5, 23.0];
  const zoom = 5;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      {/* Base Layer (inchangé) */}
      {mapStyle === "standard" ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.ceeddrdc.org/">CEEDD</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      ) : (
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      )}

      {/* Markers with Clustering */}
      <MarkerClusterGroup>
        {useMemo(
          () =>
            features.map((feature) => {
              const isSelected = feature.id === selectedFeatureId;
              // const stateColorClass =
              //   feature.state === "Functional"
              //     ? "text-green-600"
              //     : feature.state === "Needs Repair"
              //     ? "text-yellow-600"
              //     : "text-red-600";

              return (
                <Marker
                  key={feature.id}
                  position={[feature.lat, feature.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => onFeatureClick(feature),
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup closeButton={false} className="custom-popup ">
                    <div className="min-w-64 max-w-sm font-sans text-gray-800 flex flex-col gap-3">
                      {/* TITRE PRINCIPAL ET TYPE */}
                      <div className="flex items-center gap-2">
                        <span>Zone : </span>
                        <strong className="text-base font-bold text-blue-700 leading-tight">
                          {feature.nom}
                        </strong>
                      </div>
                      <hr className="mb-3 border-gray-100" />
                      <div className="flex items-center gap-2">
                        <span>Type :</span>
                        <strong className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                          {feature.type}
                        </strong>
                      </div>

                      {/* GRILLE D'INFORMATION (pour les détails clés) */}
                      <div className="grid grid-cols-1 gap-y-2 text-sm">
                        {/* 1. Capacité Max */}
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Capacité:</span>
                          <strong className="font-semibold text-gray-800">
                            {feature.maxCapacity} m³
                          </strong>
                        </div>

                        {/* 2. Date de Construction */}
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">
                            Date de la Construction:
                          </span>
                          <strong className="font-semibold text-gray-800">
                            {/* Formatage de la date (simple) */}
                            {displayDate(feature.date_construction)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }),
          [features, selectedFeatureId, onFeatureClick]
        )}
      </MarkerClusterGroup>

      <MapUpdater
        selectedFeature={features.find((f) => f.id === selectedFeatureId)}
      />

      <CtrlZoomHandler />
      <ZoomControl position="topleft" />
      <ScaleControl position="bottomleft" imperial={false} />
    </MapContainer>
  );
};

export default LeafletMap;
