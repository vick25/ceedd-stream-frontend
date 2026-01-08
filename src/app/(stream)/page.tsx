"use client";

import { FilterCard } from "@/components/FilterCard";
import { useGetAllInfrastructures } from "@/components/hooks/useInfrastructure";
import { useGetInspections } from "@/components/hooks/useInspection";
import { useGetPhotos } from "@/components/hooks/usePhotos";
import { useTypeInfradtructures } from "@/components/hooks/useTypeInfrastructure";
import Loader from "@/components/Loader";
import { Footer } from "@/components/MapFooter";
import { Card } from "@/components/ui/card";
import { MapFeature } from "@/types/types";
import { Building2, Droplet, Package, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Import dynamique de Leaflet (SSR impossible pour Leaflet)
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
      Loading Map...
    </div>
  ),
});

export default function Home() {
  const t = useTranslations("HomePage");
  const route = useRouter();

  // --- 1. RÉCUPÉRATION DES DONNÉES (AUTOMATIQUE AVEC USEQUERY) ---
  const {
    data: infraData,
    isLoading: isInfraLoading,
    isError: isInfraError,
  } = useGetAllInfrastructures();

  // const { data: typesData, isLoading: isTypesLoading } =
  //   useAllTypeInfrastructure();
  const { data: typesData, isLoading: isTypesLoading } =
    useTypeInfradtructures();

  const { data: inspectionData } = useGetInspections();
  const { data: photosData, isPending: isPhotoPending } = useGetPhotos();

  // console.log({ infraData });
  // --- 2. ÉTATS LOCAUX ---
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(
    null,
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredFeaturesCount, setFilteredFeaturesCount] = useState<number>(0);
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite">(
    "standard",
  );

  // --- 3. LOGIQUE DE TRANSFORMATION (RÉACTIVE) ---

  // Liste des catégories pour le filtre

  // Spécifiez explicitement que le retour est un tableau de chaînes : string[]
  const typesDisponibles: string[] = useMemo(() => {
    // 1. On vérifie que results existe et est un tableau
    const results = typesData?.results;

    if (Array.isArray(results)) {
      return [
        "All",
        // 2. On mappe et on force la conversion en string
        // 3. On utilise "as string" pour rassurer TypeScript
        ...new Set(results.map((t: any) => t.nom as string)),
      ];
    }

    return ["All"];
  }, [typesData]);

  // Transformation des données brutes en MapFeature[]
  const allFeatures: MapFeature[] = useMemo(() => {
    if (!infraData?.results) return [];

    // Map des inspections pour un accès rapide par ID d'infrastructure
    const inspectionMap: Record<string, { etat: string; date: string }> = {};
    inspectionData?.results?.forEach((insp: any) => {
      const infraId = insp.infrastructure?.id;
      if (infraId) {
        inspectionMap[infraId.toString()] = {
          etat: insp.etat || "Inconnu",
          date: insp.date || "N/A",
        };
      }
    });

    const photoMap: Record<string, string[]> = {};

    // On force le type en précisant que c'est un objet contenant results
    const photos = (photosData as any)?.results;

    if (Array.isArray(photos)) {
      photos.forEach((photo: any) => {
        if (photo.object_id) {
          const id = photo.object_id.toString();
          if (!photoMap[id]) photoMap[id] = [];
          photoMap[id].push(photo.url);
        }
      });
    }

    return infraData.results
      .filter((item: any) => item.latitude !== null && item.longitude !== null)
      .map((item: any) => {
        const inspectionInfo = inspectionMap[item.id.toString()];
        const photoUrls = photoMap[item.id.toString()];

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
          imageUrls: photoUrls || null,
        };
      });
  }, [infraData, inspectionData, photosData]);

  // Filtrage final basé sur la catégorie sélectionnée
  const filteredFeatures = useMemo(() => {
    return selectedCategory === "All"
      ? allFeatures
      : allFeatures.filter((f) => f.type === selectedCategory);
  }, [allFeatures, selectedCategory]);

  // --- 4. EFFETS DE BORD ---

  // Correction Leaflet : forcer le calcul de la taille quand les données arrivent
  useEffect(() => {
    if (filteredFeatures.length > 0) {
      setFilteredFeaturesCount(filteredFeatures.length);
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [filteredFeatures.length]);

  // --- 5. GESTION DES ACTIONS ---
  const handleFeatureClick = (feature: MapFeature) => {
    setSelectedFeature(feature);
    if (window.innerWidth < 768) setIsFilterVisible(true);
  };

  const PARTNERS = [
    { name: "terrafirma", logo: "/terrafirma.png" },
    { name: "unikin", logo: "/unikin.jpeg" },
    { name: "ceedd", logo: "/ceedd.png" },
    { name: "aicpkk", logo: "/AICPKK.jpg" },
    { name: "leuven", logo: "/leuven.png" },
    { name: "vliruos", logo: "/logo_vliruos.png" },
  ];

  // console.log("photo", photosData);
  // --- 6. ÉTATS DE RENDU (CHARGEMENT / ERREUR) ---
  if (isInfraLoading || isTypesLoading) {
    return <Loader />;
  }

  if (isInfraError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="p-12 text-center border-gray-400 bg-gray-50 max-w-md">
          <Package className="h-12 w-12 text-red-900 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            {t("warning")}
          </h3>
          <p className="text-red-600 mb-4">{t("warningMessage")}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 underline font-medium"
          >
            {t("tryAgain")}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Map Section */}
      <section className="relative w-full h-150 md:h-175 bg-gray-200">
        <LeafletMap
          features={filteredFeatures}
          onFeatureClick={handleFeatureClick}
          selectedFeatureId={selectedFeature?.id}
          mapStyle={mapStyle}
        />

        {/* Toggle Filtre Mobile */}
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="md:hidden absolute top-4 left-4 z-500 bg-white p-2 rounded-md shadow-lg text-blue-600 font-bold text-sm"
        >
          {isFilterVisible ? "Masquer Info" : "Afficher Info"}
        </button>

        {/* Overlay Contrôles et Filtres */}
        <div className="absolute -top-6 right-0 h-full w-full pointer-events-none flex flex-col items-end z-1000 md:p-6">
          {/* Style Map Selector */}
          <div className="pointer-events-auto bg-white rounded-lg shadow-lg border border-gray-100 p-1 flex mb-4 mr-4 md:mr-0 mt-4">
            <button
              onClick={() => setMapStyle("standard")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mapStyle === "standard"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              OSM
            </button>
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
              filteredFeaturesCount={filteredFeaturesCount}
              onClose={() => setIsFilterVisible(false)}
              availableCategories={typesDisponibles}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("overView")}
            </h2>
            <p className="text-gray-600 mt-2">{t("overViewIntro")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="h-10 md:h-12 object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}

// Composant Interne pour les cartes de statistiques
function StatCard({
  icon,
  title,
  value,
  subTitle,
}: {
  icon: any;
  title: string;
  value: string | number;
  subTitle: string;
}) {
  return (
    <div className=" hover:bg-white border border-transparent rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group">
      <div className="text-blue-600 flex justify-center mb-4">{icon}</div>
      <h3 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
        {title}
      </h3>
      <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{subTitle}</p>
    </div>
  );
}
