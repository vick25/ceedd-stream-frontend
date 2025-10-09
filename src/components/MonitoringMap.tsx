"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Icône personnalisée pour les marqueurs
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
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

export default function MonitoringMapPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = selectedTypes.length
    ? infrastructures.filter((i) => selectedTypes.includes(i.type))
    : infrastructures;

  return (
    <div className="w-full h-[692px] flex bg-[#e7eaf6] overflow-hidden rounded-lg shadow-lg relative">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r p-6 overflow-y-auto scrollbar-hidden absolute  min-h-screen z-50 shadow-lg">
        <h2 className="font-bold text-lg mb-4">Filtres Infrastructures</h2>
        <div className="mb-6">
          <div className="font-semibold mb-2">Types</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeLabels).map(([type, label]) => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full border ${
                  selectedTypes.includes(type)
                    ? typeColors[type] + " border-transparent"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                onClick={() => handleTypeToggle(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* Ajoute d'autres filtres ici si besoin */}
      </aside>

      {/* Carte */}
      <main className="flex-1 h-full">
        <div className="w-full h-full">
          <MapContainer
            center={[-4.44, 15.31]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="rounded-r-lg"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((infra) => (
              <Marker
                key={infra.id}
                position={[infra.latitude, infra.longitude]}
                icon={markerIcon}
              >
                <Popup>
                  <div className="font-bold">{infra.name}</div>
                  <div className="text-xs mb-1">{typeLabels[infra.type]}</div>
                  <div className="text-xs text-gray-500">
                    {infra.owner} <br />
                    {infra.avenue && (
                      <span>
                        {infra.avenue}
                        <br />
                      </span>
                    )}
                    {infra.quartier && (
                      <span>
                        {infra.quartier}
                        <br />
                      </span>
                    )}
                    {infra.commune}
                  </div>
                  <div className="text-xs mt-1">
                    Capacité: {infra.capacity} <br />
                    Année: {infra.year}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
