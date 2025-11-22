"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChangeEvent, useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import { useGetInfrastructure } from "./hooks/useInfrastructure";
import { useGetCustomer } from "./hooks/useCustomer";
import { useAllTypeInfrastructure } from "./hooks/useTypeInfrastructure";
import Loader from "./Loader";
import Image from "next/image";

type MonitoringMapProps = {
  heightClass?: string;
  className?: string;
};

export default function MonitoringMapPage({
  heightClass = "h-[700px]",
  className = "",
}: MonitoringMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapStyle, setMapStyle] = useState("standard");

  const [selectedInfrastructure, setSelectedInfrastructure] = useState<
    any | null
  >(null);
  const [allInfrastructures, setAllInfrastructures] = useState<any[]>([]);
  const [filteredInfrastructures, setFilteredInfrastructures] = useState<any[]>(
    []
  );
  const [typesDisponibles, setTypesDisponibles] = useState<any[]>([]);
  const [typeSelectionne, setTypeSelectionne] = useState("Tous");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mutationInfrastructure = useGetInfrastructure();
  const mutationCustomer = useGetCustomer();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();

  useEffect(() => {
    mutationInfrastructure.mutate();
    mutationCustomer.mutate();
    mutationTypeInfrastructure.mutate();
  }, []);

  useEffect(() => {
    if (mutationInfrastructure.data?.results?.length > 0) {
      const convertInfrastructure = mutationInfrastructure.data.results;
      setAllInfrastructures(convertInfrastructure);
      setFilteredInfrastructures(convertInfrastructure);

      const types = [
        ...new Set(
          convertInfrastructure.map((i: any) => i.type_infrastructure.nom)
        ),
      ];
      setTypesDisponibles(types);
    }
  }, [mutationInfrastructure.data]);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTypeSelectionne(selected);
    setFilteredInfrastructures(
      selected === "Tous"
        ? allInfrastructures
        : allInfrastructures.filter(
            (infra) => infra.type_infrastructure.nom === selected
          )
    );
  };

  const handleMarkerClick = (infra: any) => setSelectedInfrastructure(infra);

  if (!isClient) return <div className={`${heightClass} w-full`} />;

  return (
    <div
      className={`w-full ${heightClass} flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden shadow-xl ${className}`}
    >
      {/* ======= MAP SECTION ======= */}
      <main className="flex-1 h-full relative">
        <div className="flex absolute top-4 right-4 z-999 border border-blue-500 rounded-lg overflow-hidden shadow-md max-w-44">
          <button
            onClick={() => setMapStyle("standard")}
            className={`px-3 py-2 text-sm font-semibold transition flex-1 text-center whitespace-nowrap
      ${
        mapStyle === "standard"
          ? "bg-white text-blue-700"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
          >
            Map
          </button>

          <button
            onClick={() => setMapStyle("satellite")}
            className={`px-3 py-2 text-sm font-semibold transition flex-1 text-center whitespace-nowrap
      ${
        mapStyle === "satellite"
          ? "bg-white text-blue-700"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
          >
            Satellite
          </button>
        </div>

        {mutationInfrastructure.isPending ? (
          <Loader />
        ) : (
          <MapContainer
            center={[-4.44, 15.31]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            {/* <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            {mapStyle === "standard" ? (
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            ) : (
              <TileLayer
                attribution="Tiles © Esri — Source: Esri, DigitalGlobe, Earthstar Geographics"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}

            {filteredInfrastructures.map((infra) => (
              <CircleMarker
                key={infra.id}
                center={[infra.latitude, infra.longitude]}
                radius={10}
                color="#16a34a"
                fillColor="#4ade80"
                fillOpacity={0.8}
                eventHandlers={{ click: () => handleMarkerClick(infra) }}
              />
            ))}
          </MapContainer>
        )}
      </main>

      {/* ======= SIDEBAR ======= */}
      <aside className="lg:w-96 w-full bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
        <h2 className="font-semibold text-lg text-gray-800 mb-4">
          Filtres & Informations
        </h2>

        <label className="text-sm font-medium text-gray-600">
          Filtrer par type
        </label>
        <select
          value={typeSelectionne}
          onChange={handleFilterChange}
          className="w-full mt-2 mb-4 border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 shadow-sm "
        >
          <option value="Tous">Tous</option>
          {typesDisponibles.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* DETAILS INFRASTRUCTURE */}
        <h3 className="font-bold text-md text-gray-700 border-b border-gray-300 pb-2 mb-4">
          Détails de l'infrastructure
        </h3>

        {selectedInfrastructure ? (
          <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-gray-300 shadow-sm">
            <h4 className="font-extrabold text-xl text-gray-900">
              {selectedInfrastructure.nom}
            </h4>

            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
              <Image
                src="/1.jpg"
                alt="image infrastructure"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Adresse:</span>
                <span className="font-semibold text-gray-800">
                  {selectedInfrastructure.client.avenue},{" "}
                  {selectedInfrastructure.client.commune}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold">
                  {selectedInfrastructure.type_infrastructure?.nom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacité:</span>
                <span className="font-semibold">
                  {selectedInfrastructure.capacite}{" "}
                  {selectedInfrastructure.unite}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Année:</span>
                <span className="font-semibold">
                  {new Date(
                    selectedInfrastructure.date_construction
                  ).getFullYear()}
                </span>
              </div>
            </div>
            <div className="w-40 h-20 relative">
              <Image
                src="/terrafirma.png"
                fill
                alt="logo partenaire"
                className=" object-over"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 italic py-6">
            ➤ Cliquez sur un marqueur pour afficher les détails.
          </p>
        )}

        {/* PARTENAIRES */}
        <div className="border-t border-t-gray-300 pt-4 mt-3">
          <p className="font-semibold text-sm text-gray-700">Nos Partenaires</p>
          <div className="flex items-center gap-3 w-full h-20">
            <Image
              src="/ceedd.png"
              width={50}
              height={50}
              sizes=""
              className="rounded-lg"
              alt="Logo partenaire"
            />
            <span className="text-xs uppercase font-semibold text-green-700 leading-4">
              Centre d'études environnementales pour le développement durable
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
