"use client";

import { MapFeature } from "@/types/types";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  ScaleControl,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

interface LeafletMapProps {
  features: MapFeature[];
  onFeatureClick: (feature: MapFeature) => void;
  selectedFeatureId?: string;
  mapStyle: "standard" | "satellite";
}

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

// Component to handle Ctrl + Scroll to Zoom
const CtrlZoomHandler: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.disable();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key || e.metaKey) {
        map.scrollWheelZoom.enable();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key || e.metaKey) {
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
      <CtrlZoomHandler />
      <ZoomControl position="topleft" />
      <ScaleControl position="bottomleft" imperial={false} />

      {/* Base Layer */}
      {mapStyle === "standard" ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      ) : (
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      )}

      {/* Memoized Markers with Clustering */}
      <MarkerClusterGroup>
        {useMemo(
          () =>
            features.map((feature) => {
              const isSelected = feature.id === selectedFeatureId;
              const stateColorClass =
                feature.state === "Functional"
                  ? "text-green-600"
                  : feature.state === "Needs Repair"
                  ? "text-yellow-600"
                  : "text-red-600";

              return (
                <CircleMarker
                  key={feature.id}
                  center={[feature.lat, feature.lng]}
                  radius={isSelected ? 12 : 8}
                  pathOptions={{
                    color: isSelected ? "#1d4ed8" : "#3b82f6",
                    fillColor: isSelected ? "#1d4ed8" : "#60a5fa",
                    fillOpacity: 0.8,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => onFeatureClick(feature),
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup closeButton={false} className="custom-popup">
                    <div className="text-center min-w-80">
                      <strong className="block text-blue-600 font-sans text-sm mb-1">
                        {feature.type}
                      </strong>
                      <span className="text-gray-600 text-xs font-sans block mb-2">
                        {feature.location}
                      </span>
                      <span
                        className={`text-xs font-bold font-sans ${stateColorClass} px-2 py-1 bg-gray-100 rounded-full border border-gray-200`}
                      >
                        {feature.state}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            }),
          [features, selectedFeatureId, onFeatureClick]
        )}
      </MarkerClusterGroup>

      <MapUpdater
        selectedFeature={features.find((f) => f.id === selectedFeatureId)}
      />
    </MapContainer>
  );
};

export default LeafletMap;
