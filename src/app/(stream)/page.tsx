"use client";

import { useMemo, useState, memo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Building2, Droplet, Package, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { FilterCard } from "@/components/FilterCard";
import { useBailleurs } from "@/components/hooks/useBailleur";
import { useGetAllInfrastructures } from "@/components/hooks/useInfrastructure";
import { useGetInspections } from "@/components/hooks/useInspection";
import { useGetPhotos } from "@/components/hooks/usePhotos";
import { useTypeInfradtructures } from "@/components/hooks/useTypeInfrastructure";
import { Footer } from "@/components/MapFooter";
import { Card } from "@/components/ui/card";
import { MapFeature } from "@/types/types";

// 1. Composant de chargement léger pour éviter de bloquer tout l'écran
const MapLoader = () => (
  <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100 animate-pulse">
    <div className="text-center">
      <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
      <p>Chargement de la carte...</p>
    </div>
  </div>
);

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <MapLoader />,
});

const PARTNERS = [
  { name: "terrafirma", logo: "/terrafirma.png" },
  { name: "unikin", logo: "/unikin.jpeg" },
  { name: "ceedd", logo: "/ceedd.png" },
  { name: "ai cpkk", logo: "/AICPKK.jpg" },
  { name: "leuven", logo: "/leuven.png" },
  { name: "vliruos", logo: "/logo_vliruos.png" },
];
// 2. Mémoïsation des composants de l'interface pour éviter les re-renders inutiles
const StatCard = memo(({ icon, title, value, subTitle }: any) => (
  <div className="hover:bg-white border border-transparent rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group">
    <div className="text-blue-600 flex justify-center mb-4">{icon}</div>
    <h3 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
      {title}
    </h3>
    <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
    <p className="mt-1 text-sm text-gray-600">{subTitle}</p>
  </div>
));
StatCard.displayName = "StatCard";

export default function Home() {
  const t = useTranslations("HomePage");

  // --- RÉCUPÉRATION DES DONNÉES ---
  const {
    data: infraData,
    isLoading: isInfraLoading,
    isError: isInfraError,
  } = useGetAllInfrastructures();
  const { data: typesData } = useTypeInfradtructures();
  const { data: inspectionData } = useGetInspections();
  const { data: photosData } = useGetPhotos();
  const { data: bailleursData } = useBailleurs();

  // --- ÉTATS LOCAUX ---
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(
    null,
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite">(
    "standard",
  );

  // --- OPTIMISATION DU TRAITEMENT DES DONNÉES (Performance critique) ---

  // Création de Maps (dictionnaires) pour un accès O(1) au lieu de O(n)
  const inspectionMap = useMemo(() => {
    const map: Record<string, any> = {};
    inspectionData?.results?.forEach((insp: any) => {
      if (insp.infrastructure?.id) {
        map[insp.infrastructure.id.toString()] = {
          etat: insp.etat || "Inconnu",
          date: insp.date || "N/A",
        };
      }
    });
    return map;
  }, [inspectionData]);

  const photoMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    (photosData as any)?.results?.forEach((photo: any) => {
      if (photo.related_object.type === "infrastructure") {
        const id = photo.object_id.toString();
        if (!map[id]) map[id] = [];
        map[id].push(photo.url);
      }
    });
    return map;
  }, [photosData]);

  const bailleursMap = useMemo(() => {
    const map: Record<string, String[]> = {};
    (photosData as any)?.results?.forEach((photo: any) => {
      if (photo.related_object.type === "bailleur") {
        const id = photo.object_id.toString();
        if (!map[id]) map[id] = [];
        map[id].push(photo.url);
      }
    });
    return map;
  }, [photosData]);

  // console.log({ bailleursData });
  // console.log({ bailleursMap });
  // Transformation principale : légère car elle pioche dans les dictionnaires déjà prêts
  const allFeatures = useMemo(() => {
    if (!infraData?.results) return [];

    return infraData.results
      .filter((item: any) => item.latitude !== null && item.longitude !== null)
      .map((item: any) => {
        const idStr = item.id.toString();

        // 1. Trouver le bailleur qui finance cette infrastructure
        const bailleurAssocie = bailleursData?.results.find((b: any) =>
          b.finances.some(
            (f: any) => f.infrastructure?.id?.toString() === idStr,
          ),
        );

        // 2. Récupérer l'ID du bailleur pour piocher dans la photoMap
        const bailleurId = bailleurAssocie?.id?.toString();
        return {
          id: idStr,
          lat: item.latitude,
          lng: item.longitude,
          nom: item.nom,
          type: item.type_infrastructure?.nom,
          location: item.city,
          lastVerification: item.last_update_date,
          date_construction: item.date_construction,
          waterVolume: item.current_volume,
          maxCapacity: item.capacite,
          date: inspectionMap[idStr]?.date || "Non renseignée",
          etat: inspectionMap[idStr]?.etat || "Inconnu",
          imageUrls: photoMap[idStr] || null,
          logoUrls: bailleurId ? bailleursMap[bailleurId] : null,
        };
      });
  }, [infraData, inspectionMap, photoMap, bailleursMap, bailleursData]);

  const filteredFeatures = useMemo(() => {
    return selectedCategory === "All"
      ? allFeatures
      : allFeatures.filter((f: any) => f.type === selectedCategory);
  }, [allFeatures, selectedCategory]);

  const typesDisponibles: any[] = useMemo(() => {
    const results = typesData?.results;
    return results
      ? ["All", ...new Set(results.map((t: any) => t.nom as string))]
      : ["All"];
  }, [typesData]);

  // --- GESTION DES ACTIONS ---
  const handleFeatureClick = useCallback((feature: MapFeature) => {
    setSelectedFeature(feature);
    if (window.innerWidth < 768) setIsFilterVisible(true);
  }, []);

  // Erreur fatale
  if (isInfraError) return <ErrorState t={t} />;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Map Section - Rendu progressif */}
      <section className="relative w-full h-150 md:h-210 bg-gray-200">
        {isInfraLoading ? (
          <MapLoader />
        ) : (
          <LeafletMap
            features={filteredFeatures}
            selectedCategory={selectedCategory}
            onFeatureClick={handleFeatureClick}
            selectedFeatureId={selectedFeature?.id}
            mapStyle={mapStyle}
          />
        )}

        {/* Overlay : On garde l'UI interactive même pendant le chargement des données */}
        <div className="absolute top-3 right-4 z-1000 flex flex-col items-end pointer-events-none">
          <div className="pointer-events-auto bg-white/90 backdrop-blur rounded-lg shadow p-1 flex mb-4 border border-gray-100">
            {/* Sélecteur de style simplifié */}
            <button
              onClick={() => setMapStyle("standard")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md cursor-pointer ${
                mapStyle === "standard"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500"
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => setMapStyle("satellite")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md cursor-pointer ${
                mapStyle === "satellite"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500"
              }`}
            >
              SATELLITE
            </button>
          </div>

          {/* Filter Card */}
          <div
            className={`
            w-full md:w-95 bg-white/95 backdrop-blur-sm shadow-2xl overflow-y-auto pointer-events-auto flex flex-col transition-transform duration-300
            ${
              isFilterVisible
                ? "translate-x-0"
                : "translate-x-full md:translate-x-0 hidden md:flex"
            }
            h-full md:h-auto md:max-h-[calc(100%-6rem)] md:rounded-xl border-t md:border border-gray-100
          `}
          >
            <FilterCard
              selectedFeature={selectedFeature}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              filteredFeaturesCount={filteredFeatures.length}
              onClose={() => setIsFilterVisible(false)}
              availableCategories={typesDisponibles}
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Toujours visible pour le SEO et le LCP */}
      <section className="py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<Users className="h-10 w-10" />}
              title="Impact"
              value="900,900"
              subTitle="Population"
            />
            <StatCard
              icon={<Building2 className="h-10 w-10" />}
              title={t("currentMonitoring")}
              value={infraData?.count || 0}
              subTitle="Infrastructures"
            />
            <StatCard
              icon={<Droplet className="h-10 w-10" />}
              title={t("status")}
              value="90%"
              subTitle={t("water")}
            />
          </div>
        </div>
      </section>
      {/* Partners Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-8">{t("partnerTrust")}</h3>
          <div className="flex flex-wrap justify-center gap-8 items-centertransition-all">
            {PARTNERS.map((p) => (
              <Image
                key={p.name}
                src={p.logo}
                alt={p.name}
                width={80}
                height={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-12 md:h-16 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ErrorState({ t }: any) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="p-12 text-center max-w-md">
        <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold">{t("warning")}</h3>
        <p className="text-gray-600 my-2">{t("warningMessage")}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 underline"
        >
          {t("tryAgain")}
        </button>
      </Card>
    </div>
  );
}
