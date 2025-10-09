"use client";
import MonitoringPage from "@/components/Monitoring";
import MonitoringMapPage from "@/components/MonitoringMap";
import { Nav } from "@/components/Nav";
import { ensureSeed } from "@/lib/seed";
import { hydrateWells, useWellsStore } from "@/store/wells";
import Image from "next/image";
// import Link from "next/link";
import { useEffect } from "react";
import { WellsMap } from "@/components/Map";
//  import { useWellsStore } from "@/store/wells";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Rows } from "lucide-react";
export default function HomePage() {
  useEffect(() => {
    ensureSeed();
    hydrateWells();
  }, []);
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
      <main className="space-y-4 lg:space-y-6 min-h-screen">
        <div className="z-0">
          {/* <Image
            src="/bg.png"
            alt="bg"
            className="object-cover  w-full h-[692px]"
            width={1000}
            height={792}
          /> */}
          {/* <MonitoringMapPage /> */}
          <WellsMap wells={filtered} />
        </div>
        <section>
          <div className="flex flex-col gap-4 items-center sm:flex-row  md:flex-row justify-around md:p-6">
            <div className="flex flex-col gap-4 items-center justify-center">
              <h1 className="font-bold">Impact</h1>
              <p className="text-xl font-semibold lg:text-4xl">900,900</p>
              <span className="text-lg lg:text-xl">Population</span>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
              <h1 className="font-bold">Actuellement en surveillance</h1>
              <p className="text-xl font-semibold lg:text-4xl">2630</p>
              <span>Infrastructures</span>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
              <h1 className="font-bold">Status</h1>
              <p className="text-xl font-semibold lg:text-4xl">90 %</p>
              <span>L'eau qui coule</span>
            </div>
          </div>
        </section>
        <section className="px-6 ">
          <div className="w-full min-h-screen grid grid-cols-1  lg:grid-cols-2  grid-rows-2">
            {/* Ligne 1, Colonne 1 : Image */}
            <div className="relative  h-[350px] md:h-[700px]">
              <Image
                src="/bg.png"
                alt="Child fetching water"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Ligne 1, Colonne 2 : Texte */}
            <div className="flex flex-col justify-center items-center bg-[#f6f8fa] px-8 py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#b94a3a] font-handwriting">
                Clean water is a whole family concern.
              </h2>
              <p className="mb-4 text-gray-700 max-w-lg">
                Finding water is a daily challenge for young girls, moms and
                sons. With a charitable donation today, you can lift this
                burden.
                <br />
                <br />
                Providing a reliable and safe water source will unlock potential
                by returning time for study, work, and imagination.
              </p>
              <button className="mt-2 px-6 py-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 flex items-center gap-2">
                <span>💧</span> Learn More
              </button>
            </div>
            {/* Ligne 2, Colonne 1 : Texte */}
            <div className="flex flex-col justify-center items-center bg-[#f6f8fa] px-8 py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#b94a3a] font-handwriting">
                A gift of lasting opportunity.
              </h2>
              <p className="mb-4 text-gray-700 max-w-lg">
                You'll come alongside our local teams who'll build water wells,
                small dams, spring protections and other water sources.
                <br />
                <br />
                Then, together,{" "}
                <span className="text-blue-700 underline">
                  we'll make sure they keep working for years to come
                </span>
                , creating opportunity all along the way.
              </p>
            </div>
            {/* Ligne 2, Colonne 2 : Image */}
            <div className="relative  h-[350px] md:h-[700px]">
              <Image
                src="/bg.png"
                alt="Child fetching water"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
        <div>
          <section className=" bg-gradient-to-br from-green-100 via-white to-blue-50 border-0 shadow-lg h-96">
            <div className="flex flex-col justify-center items-center w-full p-4 md:p-8 gap-6 md:gap-10">
              {/* <div className="w-full flex items-center text-center "> */}
              <Image
                src="/logo.jpg"
                alt="logo"
                width={40}
                height={40}
                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full flex items-center"
              />
              {/* </div> */}
              <h1 className="max-w-4xl text-center">
                You can help end the water crisis and restore hope. Together
                we'll provide access to clean, safe and reliable water across
                sub-Saharan Africa - one community at a time.
              </h1>
              <button className="px-6 py-2 rounded-lg bg-gradient-to-tr from-green-500 to-green-700 via-blue-700 text-white">
                {" "}
                Donate
              </button>
            </div>
          </section>
          <section className="z-0">
            <div className=" relative w-full h-[600px]">
              <Image
                src="/frontreview.jpg"
                alt="logo"
                fill
                className="w-ful md:w-full md:h-[600px] object-cover"
              />
              <div className="bg-black/50 h-40 absolute w-full bottom-0">
                <p className="text-white max-w-2xl px-24 py-8">
                  Je n'ai jamais été témoin d'une organisation caritative qui en
                  offre plus pour chaque dollar que The Water Project.
                </p>
                <Link
                  href="#"
                  className="px-24 text-white flex items-center gap-1 text-lg hover:underline transition-all duration-200"
                >
                  <ArrowRight className="w-4 h-4" />
                  Reverend ong
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
