"use client";

import dynamic from "next/dynamic";
const MonitoringMap = dynamic(() => import("../components/MonitoringMap"), {
  ssr: false,
});

import { Building2, Users, Droplet } from "lucide-react";
import { useInfrastructures } from "@/components/hooks/useInfrastructure";

export default function HomePage() {
  const { data: infrastructures } = useInfrastructures();
  console.log({ infrastructures });
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Map Hero Section */}
      <section className="relative z-0 mt-20 overflow-hidden">
        <div className="w-full h-[420px] md:h-[560px] lg:h-screen rounded-3xl overflow-hidden shadow-xl">
          <MonitoringMap heightClass="h-full" />
        </div>

        {/* Title overlay */}
        {/* <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-sm border border-white/40">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Monitoring National des Infrastructures Hydrauliques
          </h1>
        </div> */}
      </section>

      {/* Stats Section */}
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
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {infrastructures?.count}
              </p>
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
  );
}
