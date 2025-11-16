"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
} from "react-leaflet";
import { useGetInfrastructure } from "./hooks/useInfrastructure";
import { useGetCustomer } from "./hooks/useCustomer";
import { useAllTypeInfrastructure } from "./hooks/useTypeInfrastructure";
import { useZoneContributive } from "./hooks/useZoneContributive";
import Loader from "./Loader";
import { Poppins } from "next/font/google";
import Image from "next/image";
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});
// Icône personnalisée pour les marqueurs
const markerIcon = new L.Icon({
  // iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const infrastructures = [
  {
    id: "1",
    name: "Wembo (Eglise ACNA)",
    type: "well",
    owner: "Boniface",
    avenue: "Kiswaka",
    quartier: "",
    commune: "Mont Ngafula",
    latitude: -4.4434378,
    longitude: 15.3146532,
    capacity: 9000,
    year: 2023,
  },
  {
    id: "2",
    name: "MULUMBA",
    type: "cistern",
    owner: "Celet",
    avenue: "Tshiswaka 30",
    quartier: "",
    commune: "Mont Ngafula",
    latitude: -4.4433351,
    longitude: 15.3137799,
    capacity: 9000,
    year: 2023,
  },
  {
    id: "3",
    name: "TAKOY",
    type: "cistern",
    owner: "Michel",
    avenue: "Tshiswaka 43",
    quartier: "",
    commune: "Mont Ngafula",
    latitude: -4.442892,
    longitude: 15.3152628,
    capacity: 9000,
    year: 2023,
  },
  {
    id: "4",
    name: "MIKULU MILOLO",
    type: "vegetation",
    owner: "Yanki",
    avenue: "boboliko 52",
    quartier: "Mama yemo",
    commune: "Mont Ngafula",
    latitude: -4.4101686,
    longitude: 15.2933735,
    capacity: 3000,
    year: 2023,
  },
  {
    id: "5",
    name: "Lwenjoko",
    type: "drainage",
    owner: "Levi's",
    avenue: "De la montagne 39",
    quartier: "ngafani",
    commune: "Selembao",
    latitude: -4.4051651,
    longitude: 15.2868674,
    capacity: 3000,
    year: 2023,
  },
  {
    id: "6",
    name: "SHONGO",
    type: "drainage",
    owner: "Rose",
    avenue: "Dela montagne n 34",
    quartier: "ngafani",
    commune: "Selembao",
    latitude: -4.4055332,
    longitude: 15.2871697,
    capacity: 3000,
    year: 2023,
  },
  {
    id: "7",
    name: "MBONGO Etapé",
    type: "well",
    owner: "Kela",
    avenue: "",
    quartier: "Kimvula",
    commune: "Mont-ngafula",
    latitude: -4.50073,
    longitude: 15.21222,
    capacity: 9000,
    year: 2024,
  },
  {
    id: "8",
    name: "MBEMBA",
    type: "cistern",
    owner: "Marie",
    avenue: "Av Kazela N°12",
    quartier: "Heradi",
    commune: "Selembao",
    latitude: -4.4057949,
    longitude: 15.2872176,
    capacity: 3000,
    year: 2023,
  },
  {
    id: "9",
    name: "birere",
    type: "well",
    owner: "cestin",
    avenue: "Mubutu n 5",
    quartier: "",
    commune: "Mont ngafula",
    latitude: -4.4056072,
    longitude: 15.2936044,
    capacity: 9000,
    year: 2023,
  },
  {
    id: "10",
    name: "nzangi",
    type: "well",
    owner: "constant",
    avenue: "Mobutu",
    quartier: "",
    commune: "Mont ngafula",
    latitude: -4.4126898,
    longitude: 15.2906245,
    capacity: 5000,
    year: 2023,
  },
];

const typeLabels: Record<string, string> = {
  well: "Puits",
  cistern: "Citerne",
  vegetation: "Végétation",
  drainage: "Drainage",
};

const typeColors: Record<string, string> = {
  well: "bg-blue-200 text-blue-800",
  cistern: "bg-green-200 text-green-800",
  vegetation: "bg-yellow-200 text-yellow-800",
  drainage: "bg-red-200 text-red-800",
};

type MonitoringMapProps = {
  heightClass?: string; // Tailwind height class to control container height
  className?: string; // Optional extra classes
};

export default function MonitoringMapPage({
  heightClass = "h-[792px]",
  className = "",
}: MonitoringMapProps) {
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<
    any | null
  >(null);

  const [allInfrastructures, setAllInfrastructures] = useState<any[]>([]);
  const [filteredInfrastructures, setFilteredInfrastructures] = useState<any[]>(
    []
  );
  const [typesDisponibles, setTypesDisponibles] = useState<any[]>([]);
  const [mapType, setMapType] = useState<"standard" | "satellte">("standard");
  const [typeSelectionne, setTypeSelectionne] = useState("Tous");

  const handleMarkerClick = (infra: any) => {
    setSelectedInfrastructure(infra);
  };
  // Initialisation des mutations
  const mutationInfrastructure = useGetInfrastructure();
  const mutationCustomer = useGetCustomer();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();
  // const mutationZone = useZoneContributive();

  // Déclenchement de TOUTES les requêtes au montage
  useEffect(() => {
    mutationInfrastructure.mutate();
    mutationCustomer.mutate();
    mutationTypeInfrastructure.mutate();
  }, [
    mutationInfrastructure.mutate,
    mutationCustomer.mutate,
    mutationTypeInfrastructure.mutate,
  ]);

  // ----------------------------------------------------
  //  Traitement des données de référence (Création des maps)
  // ----------------------------------------------------
  useEffect(() => {
    if (
      mutationInfrastructure.data &&
      mutationInfrastructure.data.results.length > 0
    ) {
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
  // console.log({ typesDisponibles });

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTypeSelectionne(selected);

    if (selected === "Tous") {
      setFilteredInfrastructures(allInfrastructures);
    } else {
      setFilteredInfrastructures(
        allInfrastructures.filter(
          (infra) => infra.type_infrastructure.nom === selected
        )
      );
    }
  };

  // ----------------------------------------------------
  //  Traitement des données d'Infrastructure
  // ----------------------------------------------------

  //  Loader Combiné
  const isPending = mutationInfrastructure.isPending;
  const hasData = filteredInfrastructures.length > 0 && !isPending;

  return (
    <div
      className={`w-full ${heightClass} flex bg-[#e7eaf6] overflow-hidden rounded-lg shadow-lg ${className}`}
    >
      {/* Carte */}
      <main className="flex-1 h-full">
        {isPending || !hasData ? (
          <Loader />
        ) : (
          <div className="w-full h-full">
            <MapContainer
              center={[-4.44, 15.31]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredInfrastructures.map((infra) => {
                return (
                  <CircleMarker
                    key={infra.id}
                    // position={[infra.latitude, infra.longitude]}
                    center={[infra.latitude, infra.longitude]}
                    radius={8}
                    color="green"
                    fillColor="skyblue"
                    fillOpacity={0.8}
                    // icon={markerIcon}
                    eventHandlers={{
                      click: () => {
                        handleMarkerClick(infra);
                      },
                    }}
                  >
                    {/* <Popup
                      offset={[0, -10]} 
                      className={`w-96 ${poppins.className} z-50`} // <-- Ajustement de la largeur
                    >
                      <div className="flex flex-col gap-1 text-sm p-2">
                        <h1 className="font-bold text-lg mb-1 border-b border-b-gray-300 pb-1">
                          {infra.nom}
                        </h1>

                        
                        <div className="relative w-full h-40 mb-2 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src="/1.jpg"
                            alt="image infrastructure"
                            fill
                            className="object-cover"
                            sizes="(max-width: 600px) 100vw, 350px"
                          />
                        </div>

                      
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Adresse:
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {infra.client.avenue},{infra.client.commune}
                          </span>
                        </div>

                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Type:
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {infra.type_infrastructure?.nom}
                          </span>
                        </div>

                       
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Capacité:
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {infra.capacite} {infra.unite}
                          </span>
                        </div>

                      
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Année:
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {new Date(infra.date_construction).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </Popup> */}
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        )}
      </main>
      {/* Sidebar */}
      <aside className="w-96 hidden lg:block bg-white border-r border-r-gray-300 p-6  scrollbar-hidden h-full shadow-lg  ">
        <div className="mb-4 flex  flex-col gap-2 space-y-4 max-h-max">
          <div>
            <div className="font-semibold mb-2 text-sm">Filtre par Type</div>
            <div className="flex flex-wrap gap-2">
              <select
                id="typeSelect"
                value={typeSelectionne}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
              >
                <option value="Tous">Tous</option>
                {typesDisponibles.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="font-bold text-md border-b border-b-gray-100 pb-2  text-gray-700 mt-2">
            Détails de l'Infrastructure
          </h3>

          {selectedInfrastructure ? (
            <div
              className={`flex flex-col gap-6 text-sm p-4 bg-gray-50 rounded-xl border border-blue-200 shadow-lg `}
            >
              <h4 className="font-extrabold text-xl mb-1 text-gray-800">
                {selectedInfrastructure.nom}
              </h4>

              {/* Image - Remplacement de <Image> par <img> */}
              <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-gray-300">
                {/* Utilisation d'une image placeholder standard */}
                <Image
                  src="/1.jpg"
                  alt="image infrastructure"
                  fill
                  className="object-cover"
                  sizes="(max-width: 600px) 100vw, 350px"
                />
              </div>

              {/* Adresse */}
              <div className="flex justify-between py-1 border-t border-gray-200">
                <span className="font-medium text-gray-600">Adresse:</span>
                <span className="font-semibold text-gray-800 text-right">
                  {selectedInfrastructure.client.avenue},{" "}
                  {selectedInfrastructure.client.commune}
                </span>
              </div>

              {/* Type */}
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">Type:</span>
                <span className="font-semibold text-gray-800">
                  {selectedInfrastructure.type_infrastructure?.nom}
                </span>
              </div>

              {/* Capacité */}
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">Capacité:</span>
                <span className="font-semibold text-gray-800">
                  {selectedInfrastructure.capacite}{" "}
                  {selectedInfrastructure.unite}
                </span>
              </div>

              {/* Année */}
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-medium text-gray-600">
                  Année de construction:
                </span>
                <span className="font-semibold text-gray-800">
                  {new Date(
                    selectedInfrastructure.date_construction
                  ).getFullYear()}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 italic bg-white rounded-lg border border-gray-200 shadow-inner h-(--size-container) flex items-center justify-center">
              Cliquez sur un marqueur sur la carte pour voir les détails ici.
            </div>
          )}
        </div>
        {/* Ajoute d'autres filtres ici si besoin */}
        <div className="border-t border-t-gray-100 flex flex-col gap-4">
          <span className="py-2 font-semibold">Nos Partenaires</span>
          <div className="flex flex-col gap-2">
            <div className="flex  gap-4 ">
              <Image
                src="/ceedd.png"
                alt="logo partenaire"
                height={40}
                width={40}
                className="object-cover rounded-2xl md:h-20 md:w-20 lg:h-24 lg:w-24"
              />
              <span className="uppercase font-semibold text-green-700">
                Centre d'études environnementales pour le développement durable
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
