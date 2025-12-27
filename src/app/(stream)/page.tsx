"use client";

import { FilterCard } from "@/components/FilterCard";
import { useGetInfrastructure } from "@/components/hooks/useInfrastructure";
import { useGetInspections } from "@/components/hooks/useInspection";
import { useAllTypeInfrastructure } from "@/components/hooks/useTypeInfrastructure";
import Loader from "@/components/Loader";
import { MapFeature } from "@/types/types";
import { Building2, Droplet, Users } from "lucide-react";
import { useTranslations } from "next-intl";

// Remplacement de l'import MOCK_FEATURES

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

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
  nom: string;
  type_infrastructure: { nom: string };
  city: string;
  last_update_date: string;
  date_construction: string;
  current_volume: number;
  capacite: number;
}

export default function Home() {
  const t = useTranslations("HomePage");
  // 1. HOOKS D'API
  const mutationInfrastructure = useGetInfrastructure();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();
  const { data: inspectionData } = useGetInspections();
  const result = mutationInfrastructure.data?.count;

  // console.log({ mutationInfrastructure });
  // 2. ÉTATS LOCAUX (pour la carte et les filtres)
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(
    null,
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(`All`);
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite">(
    "standard",
  );
  const [typesDisponibles, setTypesDisponibles] = useState<string[]>([`All`]);

  // États pour stocker les données brutes
  const [rawData, setRawData] = useState<InfrastructureData[]>([]);

  // 1. HOOKS D'API
  const mutationInfrastructure = useGetInfrastructure();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();
  const { data: inspectionData } = useGetInspections();
  const result = mutationInfrastructure.data?.count;
  console.log({ inspectionData });
  //--- État de chargement consolidé
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
      setRawData(
        infrastructures.filter(
          (infra: InfrastructureData) =>
            infra.latitude !== null && infra.longitude !== null,
        ),
      );
    }
  }, [mutationInfrastructure.data]);

  // --- LOGIQUE DE TRAITEMENT DES TYPES (Catégories) ---
  useEffect(() => {
    const typesData = mutationTypeInfrastructure.data;

    if (typesData?.results?.length > 0) {
      // Assurez-vous que 'nom' est la propriété correcte
      const types: any[] = [
        `All`,
        ...new Set(typesData.results.map((t: any) => t.nom)),
      ];
      setTypesDisponibles(types);
    }
  }, [mutationTypeInfrastructure.data]);

  // --- TRANSFORMATION DES DONNÉES BRUTES EN MapFeature[] (pour la carte) ---
  //--- function de mémoïsation pour éviter les recalculs inutiles

  const inspectionStateMap = useMemo(() => {
    const map: Record<string, { etat: string; date: string }> = {};

    if (!inspectionData?.results || !Array.isArray(inspectionData.results)) {
      return map;
    }

    inspectionData.results.forEach((insp: any) => {
      // 1. On récupère l'ID de l'infrastructure (2, 5, etc.)
      const infraId = insp.infrastructure?.id;

      // 2. On récupère l'état directement ("mauvais", "moyen")
      const etatActuel = insp.etat;
      const lastInspection = insp.date;

      if (infraId) {
        // On utilise l'ID de l'infrastructure comme CLÉ pour la map
        map[infraId.toString()] = {
          etat: etatActuel || "Inconnu",
          date: lastInspection || "N/A",
        };
      }
    });

    return map;
  }, [inspectionData]);

  const allFeatures: MapFeature[] = useMemo(() => {
    // Si les données brutes sont vides ou non chargées, retourner un tableau vide.
    if (rawData.length === 0) return [];

    return rawData
      .filter((item) => item.latitude !== null && item.longitude !== null)
      .map((item) => {
        const inspectionInfo = inspectionStateMap[item.id.toString()];
        return {
          id: item.id.toString(),
          lat: item.latitude,
          lng: item.longitude,
          nom: item.nom,
          type: item.type_infrastructure?.nom,
          location: item.city,
          lastVerification: item.last_update_date,
          date_construction: item.date_construction,
          waterVolume: item.current_volume,
          maxCapacity: item.capacite,
          date: inspectionInfo?.date || "Non renseignée",
          etat: inspectionInfo?.etat || "Inconnu",
        };
      });
  }, [rawData, inspectionData]);

  // --- LOGIQUE DE FILTRAGE DES FEATURES (utilise allFeatures maintenant) ---
  const filteredFeatures =
    selectedCategory === `All`
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

  const PARTNERS = [
    { name: "Snel", logo: "/terrafirma.png" }, // Remplacez par vos vrais chemins
    { name: "Regideso", logo: "/unikin.jpeg" },
    { name: "USAID", logo: "/ceedd.png" },
    { name: "World Bank", logo: "/AICPKK.jpg" },
    { name: "Unicef", logo: "/leuven.png" },
  ];

  if (isLoading) {
    return <Loader />;
  }
  // --- RENDU ---
  return (
    // <div className="min-h-screen flex flex-col">
    <main className="min-h-screen flex flex-col ">
      {/* Hero / Map Section */}
      <section className="relative w-full h-[600px] md:h-[700px] bg-gray-200 ">
        {/* Indicateur de Chargement */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <p className="text-xl font-bold text-blue-600">
              {t("dataLoading")}
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
        <div className="absolute -top-2 right-0 h-full w-full pointer-events-none flex flex-col items-end justify-start z-1000 md:p-6">
          {/* Base Layer Control */}
          <div className="pointer-events-auto bg-white rounded-lg shadow-lg border border-gray-100 p-1 flex mb-4 mr-4 md:mr-0 mt-4 md:mt-0">
            <button
              onClick={() => setMapStyle("standard")}
              className={`cursor-pointer px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${mapStyle === "standard"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              OSM
            </button>
            <div className="w-px bg-gray-200 my-1 mx-1"></div>
            <button
              onClick={() => setMapStyle("satellite")}
              className={`cursor-pointer px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${mapStyle === "satellite"
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
              ${isFilterVisible
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
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("overView")}
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              {t("overViewIntro")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-blue-50/50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group">
              <Users className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="text-sm font-semibold tracking-wide text-blue-700 uppercase mt-3">
                Impact
              </h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">900,900</p>
              <p className="mt-1 block text-sm text-gray-600">Population</p>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-50/50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group">
              <Building2 className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="text-sm font-semibold tracking-wide text-blue-700 uppercase mt-3">
                {t("currentMonitoring")}
              </h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {result > 0 ? result : 0}
              </p>
              <p className="mt-1 block text-sm text-gray-600">
                Infrastructures
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-blue-50/50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group">
              <Droplet className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="text-sm font-semibold tracking-wide text-blue-700 uppercase mt-3">
                {t("status")}
              </h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">90%</p>
              <p className="mt-1 block text-sm text-gray-600">{t("water")}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Partner Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Ils nous font confiance
            </h3>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {PARTNERS.map((partner: any) => (
              <div
                key={partner.name}
                className="  transition-all duration-300 transform hover:scale-110 cursor-pointer"
              >
                {/* Remplacez l'image par votre logo ou un placeholder si pas encore de logo */}
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-8 md:h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-400">
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
