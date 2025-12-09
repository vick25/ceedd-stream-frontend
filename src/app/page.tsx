"use client";

import { FilterCard } from "@/components/FilterCard";
import { useGetInfrastructure } from "@/components/hooks/useInfrastructure";
import { useAllTypeInfrastructure } from "@/components/hooks/useTypeInfrastructure";
import { MapFeature } from "@/types/types";
import { Building2, Droplet, Users } from "lucide-react";

// Remplacement de l'import MOCK_FEATURES

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
// import { useGetInfrastructure, useAllTypeInfrastructure } from "./hooks"; // Assurez-vous que le chemin vers vos hooks est correct

// Dynamic import for Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
      Loading Map...
    </div>
  ),
});

// Interface pour la structure des données brutes (ajustez si nécessaire)
interface InfrastructureData {
  id: number;
  latitude: number;
  longitude: number;
  type_infrastructure: { nom: string };
  city: string;
  status: "Functional" | "Needs Repair" | "Critical"; // Exemple de statuts
  last_update_date: string;
  partner: string;
  current_volume: number;
  capacity: number;
}

export default function Home() {
  // 1. HOOKS D'API
  const mutationInfrastructure = useGetInfrastructure();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();

  // 2. ÉTATS LOCAUX (pour la carte et les filtres)
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(
    null
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite">(
    "standard"
  );
  const [typesDisponibles, setTypesDisponibles] = useState<string[]>([
    "All Categories",
  ]);

  // États pour stocker les données brutes
  const [rawData, setRawData] = useState<InfrastructureData[]>([]);

  // État de chargement consolidé
  const isLoading =
    mutationInfrastructure.isPending || mutationTypeInfrastructure.isPending;

  // --- LOGIQUE DE CHARGEMENT INITIAL (Déclenchement des requêtes) ---
  useEffect(() => {
    mutationInfrastructure.mutate();
    mutationTypeInfrastructure.mutate();
  }, [mutationInfrastructure.mutate, mutationTypeInfrastructure.mutate]);

  // --- LOGIQUE DE TRAITEMENT DES DONNÉES D'INFRASTRUCTURE ---
  useEffect(() => {
    const infraData = mutationInfrastructure.data;

    if (infraData?.results?.length > 0) {
      const infrastructures: InfrastructureData[] = infraData.results;
      setRawData(infrastructures);
    }
  }, [mutationInfrastructure.data]);

  // --- LOGIQUE DE TRAITEMENT DES TYPES (Catégories) ---
  useEffect(() => {
    const typesData = mutationTypeInfrastructure.data;

    if (typesData?.results?.length > 0) {
      // Assurez-vous que 'nom' est la propriété correcte
      const types: any[] = [
        "All Categories",
        ...new Set(typesData.results.map((t: any) => t.nom)),
      ];
      setTypesDisponibles(types);
    }
  }, [mutationTypeInfrastructure.data]);

  // --- TRANSFORMATION DES DONNÉES BRUTES EN MapFeature[] (pour la carte) ---
  const allFeatures: MapFeature[] = useMemo(() => {
    // Si les données brutes sont vides ou non chargées, retourner un tableau vide.
    if (rawData.length === 0) return [];

    return rawData.map((item) => ({
      id: item.id.toString(),
      lat: item.latitude,
      lng: item.longitude,
      type: item.type_infrastructure.nom,
      location: item.city,
      state: item.status,
      lastVerification: item.last_update_date,
      fundingPartner: item.partner,
      waterVolume: item.current_volume,
      maxCapacity: item.capacity,
    }));
  }, [rawData]);

  // --- LOGIQUE DE FILTRAGE DES FEATURES (utilise allFeatures maintenant) ---
  const filteredFeatures =
    selectedCategory === "All Categories"
      ? allFeatures
      : allFeatures.filter((f) => f.type === selectedCategory);

  // --- GESTION DES INTERACTIONS ---
  const handleFeatureClick = (feature: MapFeature) => {
    setSelectedFeature(feature);
    if (window.innerWidth < 768) {
      setIsFilterVisible(true);
    }
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // --- RENDU ---
  return (
    // <div className="min-h-screen flex flex-col">
    <main className="min-h-screen flex flex-col pt-20">
      {/* Hero / Map Section */}
      <section className="relative w-full h-[600px] md:h-[700px] bg-gray-200 ">
        {/* Indicateur de Chargement */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <p className="text-xl font-bold text-blue-600">
              Chargement des données de la carte...
            </p>
          </div>
        )}

        <LeafletMap
          // Utilise les données filtrées réelles
          features={filteredFeatures}
          onFeatureClick={handleFeatureClick}
          selectedFeatureId={selectedFeature?.id}
          mapStyle={mapStyle}
        />

        {/* Mobile Toggle Button for Filter Card */}
        <button
          onClick={toggleFilter}
          className="md:hidden absolute top-4 left-4 z-500 bg-white p-2 rounded-md shadow-lg text-blue-600 font-bold text-sm"
        >
          {isFilterVisible ? "Masquer Info" : "Afficher Info"}
        </button>

        {/* Right Side Overlay Container */}
        <div className="absolute top-0 right-0 h-full w-full pointer-events-none flex flex-col items-end justify-start z-1000 md:p-6">
          {/* Base Layer Control */}
          <div className="pointer-events-auto bg-white rounded-lg shadow-lg border border-gray-100 p-1 flex mb-4 mr-4 md:mr-0 mt-4 md:mt-0">
            <button
              onClick={() => setMapStyle("standard")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mapStyle === "standard"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Carte
            </button>
            <div className="w-px bg-gray-200 my-1 mx-1"></div>
            <button
              onClick={() => setMapStyle("satellite")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mapStyle === "satellite"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Filter Card Container */}
          <div
            className={`
              w-full md:w-[380px]
              bg-white/95 backdrop-blur-sm shadow-2xl
              overflow-y-auto pointer-events-auto flex flex-col
              transition-transform duration-300 ease-in-out
              ${
                isFilterVisible
                  ? "translate-x-0"
                  : "translate-x-full md:translate-x-0 hidden md:flex"
              }
              h-full md:h-auto md:max-h-[calc(100%-4rem)] md:rounded-xl
              border-t md:border border-gray-100
            `}
          >
            <FilterCard
              selectedFeature={selectedFeature}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onClose={() => setIsFilterVisible(false)}
              // Passer la liste des catégories réelles
              availableCategories={typesDisponibles}
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Assurez-vous que StatsSection utilise également les données réelles */}
      {/* <StatsSection /> */}

      <section className="relative z-10 py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Aperçu global
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Données en temps réel sur l’état et l’impact des infrastructures de
            distribution d’eau.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all p-8 max-w-80 mx-auto">
              <Users className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="text-sm font-semibold tracking-wide text-green-700 uppercase mt-3">
                Impact
              </h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">900,900</p>
              <span className="mt-1 block text-sm text-gray-600">
                Population
              </span>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all p-8 max-w-80 mx-auto">
              <Building2 className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="text-sm font-semibold tracking-wide text-green-700 uppercase mt-3">
                Actuellement en surveillance
              </h3>
              {/* <p className="mt-2 text-4xl font-bold text-gray-900">{result}</p> */}
              <span className="mt-1 block text-sm text-gray-600">
                Infrastructures
              </span>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all p-8 max-w-80 mx-auto">
              <Droplet className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="text-sm font-semibold tracking-wide text-green-700 uppercase mt-3">
                Statut
              </h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">90%</p>
              <span className="mt-1 block text-sm text-gray-600">
                Eau fonctionnelle
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
    // </div>
  );
}
