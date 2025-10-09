"use client";
import { Nav } from "@/components/Nav";
import { WellsMap } from "@/components/Map";
import { useWellsStore } from "@/store/wells";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CsvControls } from "@/components/CsvControls";
import { Well } from "@/types/well";
const wells: Well[] = [
  {
    id: "1",
    lastName: "Wembo (Eglise ACNA)",
    firstName: "Boniface",
    sex: "M",
    avenue: "Kiswaka",
    quartier: "",
    commune: "Mont Ngafula",
    latitude: -4.4434378,
    longitude: 15.3146532,
    capacityLiters: 9000,
    constructionYear: 2023,
  },
  {
    id: "2",
    lastName: "MULUMBA",
    firstName: "Celet",
    sex: "M",
    avenue: "Tshiswaka 30",
    quartier: "",
    commune: "Mont Ngafula",
    latitude: -4.4433351,
    longitude: 15.3137799,
    capacityLiters: 9000,
    constructionYear: 2023,
  },
  {
    id: "3",
    lastName: "TAKOY",
    firstName: "Michel",
    sex: "M",
    avenue: "Tshiswaka 43",
    quartier: "",
    commune: "Mont Ngafula",
    latitude: -4.442892,
    longitude: 15.3152628,
    capacityLiters: 9000,
    constructionYear: 2023,
  },
  {
    id: "4",
    lastName: "MIKULU MILOLO",
    firstName: "Yanki",
    sex: "F",
    avenue: "boboliko 52",
    quartier: "Mama yemo",
    commune: "Mont Ngafula",
    latitude: -4.4101686,
    longitude: 15.2933735,
    capacityLiters: 3000,
    constructionYear: 2023,
  },
  {
    id: "5",
    lastName: "Lwenjoko",
    firstName: "Levi's",
    sex: "M",
    avenue: "De la montagne 39",
    quartier: "ngafani",
    commune: "Selembao",
    latitude: -4.4051651,
    longitude: 15.2868674,
    capacityLiters: 3000,
    constructionYear: 2023,
  },
  {
    id: "6",
    lastName: "SHONGO",
    firstName: "Rose",
    sex: "F",
    avenue: "Dela montagne n 34",
    quartier: "ngafani",
    commune: "Selembao",
    latitude: -4.4055332,
    longitude: 15.2871697,
    capacityLiters: 3000,
    constructionYear: 2023,
  },
  {
    id: "7",
    lastName: "MBONGO Etapé",
    firstName: "Kela",
    sex: "M",
    avenue: "",
    quartier: "",
    commune: "Mont-ngafula",
    latitude: -4.50073,
    longitude: 15.21222,
    capacityLiters: 9000,
    constructionYear: 2024,
  },
  {
    id: " 8",
    lastName: "MBEMBA",
    firstName: "Marie",
    sex: "F",
    avenue: "Av Kazela N°12",
    quartier: "Heradi",
    commune: "Selembao",
    latitude: -4.4057949,
    longitude: 15.2872176,
    capacityLiters: 3000,
    constructionYear: 2023,
  },
  {
    id: "9",
    lastName: "birere",
    firstName: "cestin",
    sex: "M",
    avenue: "Mubutu n 5",
    quartier: "",
    commune: "Mont ngafula",
    latitude: -4.4056072,
    longitude: 15.2936044,
    capacityLiters: 9000,
    constructionYear: 2023,
  },
  {
    id: "10",
    lastName: "nzangi",
    firstName: "constant",
    sex: "M",
    avenue: "Mobutu",
    quartier: "",
    commune: "Mont ngafula",
    latitude: -4.4126898,
    longitude: 15.2906245,
    capacityLiters: 5000,
    constructionYear: 2023,
  },
];
export default function WellsPage() {
  const wells = useWellsStore((s) => s.wells);
  const [q, setQ] = useState("");
  const [commune, setCommune] = useState("");
  const [year, setYear] = useState("");
  const [trim, setTrim] = useState("");
  const communes = useMemo(
    () => Array.from(new Set(wells.map((w) => w.commune))).sort(),
    [wells]
  );
  const years = useMemo(
    () =>
      Array.from(
        new Set(wells.map((w) => w.constructionYear).filter(Boolean))
      ) as number[],
    [wells]
  );
  const filtered = useMemo(() => {
    return wells.filter((w) => {
      const matchesText = [
        w.lastName,
        w.firstName,
        w.commune,
        w.avenue,
        w.quartier,
      ]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q.toLowerCase()));
      const matchesCommune = commune ? w.commune === commune : true;
      const matchesYear = year
        ? String(w.constructionYear ?? "") === year
        : true;
      const matchesTrim = trim ? (w.trimester ?? "") === trim : true;
      return matchesText && matchesCommune && matchesYear && matchesTrim;
    });
  }, [wells, q, commune, year, trim]);
  return (
    <div>
      {/* <Nav /> */}
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Puits</h1>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Nouveau puits
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              className="border rounded p-2 w-full md:max-w-md"
              placeholder="Rechercher (nom, commune, avenue)..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <CsvControls />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Toutes les communes</option>
              {communes.map((c) => (
                <option key={c.id} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Toutes les années</option>
              {years
                .sort((a, b) => b - a)
                .map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
            </select>
            <select
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Tous les trimestres</option>
              {["Trim I", "Trim II", "Trim III", "Trim IV"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              className="border rounded p-2"
              onClick={() => {
                setQ("");
                setCommune("");
                setYear("");
                setTrim("");
              }}
            >
              Réinitialiser
            </button>
          </div>
        </div>
        <WellsMap wells={wells} />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nom</th>
                <th className="p-2 text-left">Commune</th>
                <th className="p-2 text-left">Avenue</th>
                <th className="p-2 text-left">Capacité</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-t">
                  <td className="p-2">
                    <Link className="text-blue-600" href={`/wells/${w.id}`}>
                      {w.lastName} {w.firstName}
                    </Link>
                  </td>
                  <td className="p-2">{w.commune}</td>
                  <td className="p-2">{w.avenue}</td>
                  <td className="p-2">{w.capacityLiters ?? "n/d"}</td>
                  <td className="p-2">
                    <Link href={`/dashboard/${w.id}`} className="text-blue-600">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
