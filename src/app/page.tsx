"use client";

import dynamic from "next/dynamic";
const MonitoringMap = dynamic(() => import("../components/MonitoringMap"), {
  ssr: false,
});

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Map pleine largeur avec hauteur contrôlée */}
      <section className="relative z-0 mt-20 overflow-hidden">
        <div className="w-full h-[420px] md:h-[560px] lg:h-[640px] rounded-xl overflow-hidden">
          <MonitoringMap heightClass="h-full" />
        </div>
      </section>

      {/* Indicateurs clés (cards) */}
      {/* <section className="relative z-10 py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white shadow-sm p-6 text-center">
              <h2 className="text-sm font-semibold tracking-wide text-green-700 uppercase">
                Impact
              </h2>
              <p className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                900,900
              </p>
              <span className="mt-1 block text-sm text-gray-600">
                Population
              </span>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm p-6 text-center">
              <h2 className="text-sm font-semibold tracking-wide text-green-700 uppercase">
                Actuellement en surveillance
              </h2>
              <p className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                2,630
              </p>
              <span className="mt-1 block text-sm text-gray-600">
                Infrastructures
              </span>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm p-6 text-center">
              <h2 className="text-sm font-semibold tracking-wide text-green-700 uppercase">
                Statut
              </h2>
              <p className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                90%
              </p>
              <span className="mt-1 block text-sm text-gray-600">
                Eau fonctionnelle
              </span>
            </div>
          </div>
        </div>
      </section> */}

      {/* Sections éditoriales alternées */}
      <section className="relative z-10 py-12 md:py-16 bg-[#f6f8fa]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Image */}
          <div className="relative h-[320px] md:h-[520px] overflow-hidden rounded-2xl">
            <Image
              src="/bg.png"
              alt="Enfant récupérant de l'eau"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Texte */}
          <div className="rounded-2xl bg-white p-8 lg:p-12 shadow-sm flex flex-col justify-center text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#b94a3a]">
              Clean water is a whole family concern.
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Finding water is a daily challenge for young girls, moms and sons.
              With a charitable donation today, you can lift this burden.
              <br />
              <br />
              Providing a reliable and safe water source will unlock potential
              by returning time for study, work, and imagination.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 shadow transition-colors">
                <span>💧</span>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Texte */}
          <div className="rounded-2xl bg-white p-8 lg:p-12 shadow-sm order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#b94a3a]">
              A gift of lasting opportunity.
            </h3>
            <p className="text-gray-700 leading-relaxed">
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

          {/* Image */}
          <div className="relative h-[320px] md:h-[520px] overflow-hidden rounded-2xl order-1 lg:order-2">
            <Image
              src="/bg.png"
              alt="Ressource en eau sécurisée"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Appel au don */}
      <section className="relative z-10 py-16 md:py-20 bg-gradient-to-br from-green-100 via-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border shadow-lg bg-white/60 backdrop-blur p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <Image
              src="/logo.jpg"
              alt="CEEDD logo"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full"
            />
            <h2 className="max-w-3xl text-lg md:text-xl text-gray-800">
              You can help end the water crisis and restore hope. Together we'll
              provide access to clean, safe and reliable water across
              sub-Saharan Africa — one community at a time.
            </h2>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-tr from-green-500 via-green-600 to-green-700 text-white shadow hover:shadow-md transition-shadow">
              Donate
            </button>
          </div>
        </div>
      </section>

      {/* Témoignage visuel */}
      <section className="py-0">
        <div className="relative w-full h-[520px]">
          <Image
            src="/frontreview.jpg"
            alt="Review"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-3xl">
                <p className="text-white/90 text-lg md:text-xl leading-relaxed">
                  Je n'ai jamais été témoin d'une organisation caritative qui en
                  offre plus pour chaque dollar que The Water Project.
                </p>
                <Link
                  href="#"
                  className="mt-3 inline-flex items-center gap-2 text-white hover:underline transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Reverend ong
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
