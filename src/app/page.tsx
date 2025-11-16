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
        <div className="w-full h-[420px] md:h-[560px] lg:h-screen rounded-xl overflow-hidden">
          <MonitoringMap heightClass="h-full" />
        </div>
      </section>
    </main>
  );
}
