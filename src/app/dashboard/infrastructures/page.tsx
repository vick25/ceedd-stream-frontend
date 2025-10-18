"use client";
import { Locale, useTranslations } from "@/lib/i18n";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import Table from "@/components/ui/infrastructure/table";
type Props = {};

const page = (props: Props) => {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  return (
    <main className="container py-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.navigation.dashboard}</h1>
        <div className="flex gap-2">
          {/* <button
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                {locale === "fr" ? "EN" : "FR"}
              </button> */}
          <button className="bg-blue-600 text-white px-3 py-2 rounded flex flex-row gap-4 items-center">
            <PlusCircle /> Nouvelle infrastructure
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="w-full bg-white rounded-lg shadow-xl p-6">
        <Table />
      </div>
    </main>
  );
};

export default page;
