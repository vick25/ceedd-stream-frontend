"use client";
import { Nav } from "@/components/Nav";
import { useInfrastructureStore } from "@/store/infrastructure";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { Heatmap } from "@/components/charts/Heatmap";
import { InfrastructureMap } from "@/components/InfrastructureMap";
// import { DashboardStats } from "@/types/infrastructure";
import { useTranslations, Locale } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { useInfrastructures } from "@/components/hooks/useInfrastructure";
import { Building, Building2, User } from "lucide-react";
import { useCustomers } from "@/components/hooks/useCustomer";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  // const infrastructures = useInfrastructureStore((s) => s.infrastructures);
  const { data: infrastructures } = useInfrastructures();
  const router = useRouter();

  const { data: clients } = useCustomers();

  const stats = useMemo(() => {
    // const total = infrastructures.count;
    if (!infrastructures || !infrastructures.results) {
      return {
        totalInfrastructures: 0,
        totalCapacity: 0,
        totalInvestement: 0,
      };
    }
    if (!clients || !clients.results) {
      return {
        totalClients: 0,
      };
    }
    const infrastructureList = infrastructures.results;
    // const testTotal = infrastructureList.length;

    const total = infrastructures.count || infrastructureList.length;
    const clientList = clients.results;

    const ClientsCount = clients.count || clients.length;

    return {
      totalInfrastructures: total,
      totalClients: ClientsCount,
    };
  }, [infrastructures, clients]);

  // useEffect(() => {
  //   if (!isAUthentificated()) {
  //     router.push("/login");
  //   }
  // }, [router]);
  return (
    <div>
      <Nav />
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
            {/* <button className="bg-blue-600 text-white px-3 py-2 rounded">
              Nouvelle infrastructure
            </button> */}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg border bg-white">
            <div className="text-sm text-gray-500 flex items-center gap-3">
              <Building2 className="text-green-800" />{" "}
              {t.dashboard.totalInfrastructures}
            </div>
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center">
              {stats.totalInfrastructures}
            </div>
          </div>
          {/* <div className="p-4 rounded-lg border bg-white">
            <div className="text-sm text-gray-500">
              {t.dashboard.coveragePercentage}
            </div>
            <div className="text-3xl font-bold text-green-600">
             {stats.coveragePercentage}%
            </div>
          </div>  */}
          <div className="p-4 rounded-lg border bg-white">
            <div className="text-sm text-gray-500">
              {t.dashboard.typeInfrastructures}
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {/* {stats.populationImpacted.toLocaleString()} */}
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-white">
            <div className="text-sm text-gray-500 flex items-center gap-3">
              <User className="text-orange-600" />
              {t.dashboard.totalClients}
            </div>
            <div className="text-3xl font-bold text-orange-600 flex items-center justify-center">
              {stats.totalClients}
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-white">
            <div className="text-sm text-gray-500">
              {t.dashboard.totalInvestment}
            </div>
            <div className="text-3xl font-bold text-red-600">
              {/* ${stats.totalInvestment.toLocaleString()} */}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChart data={typeChartData} title="Infrastructures par type" />
          <PieChart data={statusChartData} title="État des infrastructures" />
          <BarChart
            data={communeData}
            title="Infrastructures par commune"
            xAxisKey="commune"
            bars={[
              {
                dataKey: "infrastructures",
                fill: "#3b82f6",
                name: "Infrastructures",
              },
            ]}
          />
          <Heatmap
            infrastructures={infrastructures}
            title="Carte thermique des statuts"
          />
        </div> */}

        {/* Interactive Map */}
        {/* <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">
            Carte interactive des infrastructures
          </h3>
          <InfrastructureMap
            infrastructures={infrastructures}
            locale={locale}
            height={400}
          />
        </div> */}
      </main>
    </div>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    well: "#3b82f6",
    cistern: "#10b981",
    retention_basin: "#f59e0b",
    lost_well: "#ef4444",
    dam: "#8b5cf6",
    vegetation: "#22c55e",
    drainage: "#06b6d4",
    contributive_zone: "#84cc16",
  };
  return colors[type] || "#6b7280";
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    good: "#3b82f6",
    medium: "#f59e0b",
    bad: "#ef4444",
  };
  return colors[status] || "#6b7280";
}
