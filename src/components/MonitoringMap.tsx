"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
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
  heightClass = "h-[692px]",
  className = "",
}: MonitoringMapProps) {
  const [selectedTypes, setSelectedTypes] = useState<any[]>([]);

  const [allInfrastructures, setAllInfrastructures] = useState<any[]>([]);
  const [filteredInfrastructures, setFilteredInfrastructures] = useState<any[]>(
    []
  );
  const [typesDisponibles, setTypesDisponibles] = useState<any[]>([]);
  const [typeSelectionne, setTypeSelectionne] = useState("Tous");

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

  const handleFilterChange = (e: any) => {
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

  return (
    <div
      className={`w-full ${heightClass} flex bg-[#e7eaf6] overflow-hidden rounded-lg shadow-lg ${className}`}
    >
      {/* Sidebar */}
      <aside className="w-80 hidden lg:block bg-white border-r border-r-gray-300 p-6 overflow-y-auto scrollbar-hidden h-full shadow-lg">
        <div className="mb-6 flex  flex-col gap-2">
          <div>
            <div className="font-semibold mb-2">Filtre par</div>
            <div className="flex flex-wrap gap-2">
              <select
                id="typeSelect"
                value={typeSelectionne}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
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
          <div className="grid grid-cols-1  gap-6">
            <div className="rounded-2xl border border-gray-300 bg-white shadow-sm p-4 text-center">
              <h2 className="text-sm font-semibold tracking-wide text-green-700 uppercase">
                Impact
              </h2>
              <p className="mt-2 text-xl md:text-xl font-bold text-gray-900">
                900,900
              </p>
              <span className="mt-1 block text-sm text-gray-600">
                Population
              </span>
            </div>
            <div className="rounded-2xl border  border-gray-300 bg-white shadow-sm p-4 text-center">
              <h2 className="text-sm font-semibold tracking-wide text-green-700 uppercase">
                Actuellement en surveillance
              </h2>
              <p className="mt-2 text-xl md:text-xl font-bold text-gray-900">
                2,630
              </p>
              <span className="mt-1 block text-sm text-gray-600">
                Infrastructures
              </span>
            </div>
            <div className="rounded-2xl border  border-gray-300 bg-white shadow-sm p-4 text-center">
              <h2 className="text-sm font-semibold tracking-wide text-green-700 uppercase">
                Statut
              </h2>
              <p className="mt-2 text-xl md:text-xl font-bold text-gray-900">
                90%
              </p>
              <span className="mt-1 block text-sm text-gray-600">
                Eau fonctionnelle
              </span>
            </div>
          </div>
        </div>
        {/* Ajoute d'autres filtres ici si besoin */}
      </aside>

      {/* Carte */}
      <main className="flex-1 h-full">
        {isPending ? (
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
                //  UTILISATION DES MAPS DE JOINTURE POUR CHAQUE MARQUEUR

                // const clientNom =
                // clientLabels[infra.client.toString()] || "N/A";
                // const zoneNom = zoneLabels[infra.zone.toString()] || "N/A";
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
                  >
                    <Popup className={`w-96 ${poppins.className}`}>
                      <div className="flex flex-col gap-1 text-sm p-2">
                        <h1 className="font-bold text-lg mb-1 border-b border-b-gray-300 pb-1">
                          {infra.nom}
                        </h1>

                        {/* Client */}
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Client:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {infra.client.nom}
                          </span>
                        </div>

                        {/* Type d'Infrastructure (Ajout recommandé pour la clarté) */}
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Type:
                          </span>
                          {/* Vous pouvez utiliser typeLabels pour traduire le type si nécessaire */}
                          <span className="font-semibold text-gray-800">
                            {infra.type_infrastructure?.nom}
                          </span>
                        </div>

                        {/* Capacité */}
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Capacité:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {infra.capacity} {infra.unite}
                          </span>
                        </div>

                        {/* Année */}
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Année:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {new Date(infra.date_construction).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        )}
      </main>
    </div>
  );
}
