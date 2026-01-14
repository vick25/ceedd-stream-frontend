"use client";

import { MapFeature } from "@/types/types";
import { displayDate } from "@/utils/utils";
import { Icon } from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";

const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-markercluster").then((mod) => mod.default),
  { ssr: false },
) as unknown as React.ComponentType<React.PropsWithChildren<any>>;

interface LeafletMapProps {
  features: MapFeature[];
  selectedCategory?: string;
  onFeatureClick: (feature: MapFeature) => void;
  selectedFeatureId?: string;
  mapStyle: "standard" | "satellite";
}

// A component to handle map events and update coordinates
function MapEvents({
  setCoords,
}: {
  setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
}) {
  useMapEvents({
    mousemove(e) {
      // The event object 'e' has a 'latlng' property with lat and lng
      setCoords({
        lat: e.latlng.lat.toFixed(4) as unknown as number,
        lng: e.latlng.lng.toFixed(4) as unknown as number,
      });
    },
  });
  return null; // This component doesn't render anything itself
}

// Hook personnalisé pour détecter si on est sur mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

const icons = [
  {
    type: "Citerne",
    iconUrl: "/citerne.png",
  },
  {
    type: "Déversoir",
    iconUrl: "/deversoir.png",
  },
  {
    type: "Bassin de rétention",
    iconUrl: "/bassin_retention.png",
  },
];

// Icônes adaptatives
const getIconUrl = (type: string) => {
  const iconObj = icons.find((icon) => icon.type === type);
  return iconObj ? iconObj.iconUrl : "/iconImage.png";
};

const getCustomIcon = (iconUrl: string, isMobile: boolean) =>
  new Icon({
    iconUrl,
    iconSize: isMobile ? [24, 24] : [40, 40],
    iconAnchor: isMobile ? [12, 0] : [20, 0],
    popupAnchor: [0, 0],
  });

const InvalidateSize = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    setTimeout(() => {
      map?.invalidateSize();
    }, 200);
  }, [map]);

  return null;
};

// Component to fit the features in the bounding box
const FitBounds: React.FC<{ features: MapFeature[] }> = ({ features }) => {
  const map = useMap();

  useEffect(() => {
    if (features && features.length > 0 && map) {
      // Create an array of [lat, lng] pairs from your features
      const bounds = features.map((f) => [f.lat, f.lng] as [number, number]);

      // Fit the map to these bounds
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12,
        duration: 1,
      });
    }
  }, [features, map]);

  return null;
};

const MapUpdater: React.FC<{
  selectedFeature?: MapFeature;
  isMobile: boolean;
}> = ({ selectedFeature, isMobile }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedFeature) {
      // Zoom plus faible sur mobile pour garder du contexte
      const currentZoom = map.getZoom();
      map.flyTo([selectedFeature.lat, selectedFeature.lng], currentZoom, {
        duration: 1.5,
      });
    }
  }, [selectedFeature, map]);
  return null;
};

const CtrlZoomHandler: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.scrollWheelZoom.disable();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) map.scrollWheelZoom.enable();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) map.scrollWheelZoom.disable();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [map]);
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  features,
  selectedCategory,
  onFeatureClick,
  selectedFeatureId,
  mapStyle,
}) => {
  const t = useTranslations("MapView");
  const isMobile = useIsMobile();
  const center: [number, number] = [-2.5, 23.0];
  const zoom = isMobile ? 4 : 5; // Zoom initial dézommé sur petit écran
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        // On remplace tap par dragging pour améliorer l'expérience mobile
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <InvalidateSize />

        {selectedCategory !== "All" && <FitBounds features={features} />}

        {mapStyle === "standard" ? (
          <TileLayer
            key="osm-layer"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.ceeddrdc.org/">CEEDD</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            key="satellite-layer"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        <MarkerClusterGroup>
          {useMemo(
            () =>
              features.map((feature) => (
                <Marker
                  key={feature.id}
                  position={[feature.lat, feature.lng]}
                  icon={getCustomIcon(getIconUrl(feature.type), isMobile)}
                  eventHandlers={{
                    click: () => onFeatureClick(feature),
                    // On n'active le popup au survol que sur desktop
                    mouseover: (e) => !isMobile && e.target.openPopup(),
                    mouseout: (e) => !isMobile && e.target.closePopup(),
                  }}
                >
                  <Popup closeButton={isMobile} className="custom-popup">
                    {/* Largeur adaptative : 80% de la largeur de l'écran sur mobile, fixe sur desktop */}
                    <div className="w-[80vw] sm:w-64 max-w-300px font-sans text-gray-900 flex flex-col gap-2 p-1">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-gray-400 font-bold">
                          Infrastructure
                        </span>
                        <strong className="text-sm md:text-base font-bold text-blue-700 leading-tight">
                          {feature.nom}
                        </strong>
                      </div>

                      <hr className="h-0.5 border-0 mb-2 bg-[linear-gradient(25deg,red_5%,yellow_60%,lime_90%,teal)]" />

                      <div className="grid grid-cols-2 gap-2 text-[11px] md:text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-500">Type</span>
                          <span className="font-semibold text-blue-500">
                            {feature.type}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">{t("capacity")}</span>
                          <span className="font-semibold">
                            {feature.maxCapacity} m³
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 text-[11px] md:text-xs text-gray-500 italic">
                        {`${t("builtOn")} ${displayDate(
                          feature.date_construction,
                        )}`}
                      </div>

                      {isMobile && (
                        <button
                          className="mt-2 w-full bg-blue-600 text-white py-2 rounded text-xs font-bold"
                          onClick={() => onFeatureClick(feature)}
                        >
                          {t("details")}
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )),
            [features, selectedFeatureId, onFeatureClick, isMobile],
          )}
        </MarkerClusterGroup>
        <MapUpdater
          selectedFeature={features.find((f) => f.id === selectedFeatureId)}
          isMobile={isMobile}
        />
        <CtrlZoomHandler />
        {/* On remet les contrôles en bas sur mobile pour l'accessibilité du pouce */}
        <ZoomControl position={isMobile ? "bottomright" : "topleft"} />
        {!isMobile && <ScaleControl position="bottomleft" imperial={false} />}
        <MapEvents setCoords={setCoords} />
      </MapContainer>

      <div className="hidden md:block absolute bottom-0 left-30 bg-white border border-gray-300 mb-1 px-1 text-sm font-mono z-400">
        {`${t("coordinates")}: ${coords.lat}, ${coords.lng}`}
      </div>
    </div>
  );
};

export default LeafletMap;
