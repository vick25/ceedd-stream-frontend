// This file has been refactored to use reusable components,
// state management, search trigger, i18n-ready structure,
// and TanStack Query integration placeholders.
"use client";
import { useCustomers } from "@/components/hooks/useCustomer";
import {
  useInfrastructureByAdresseLocation,
  useInfrastructureVolumeByDate,
} from "@/components/hooks/useInfrastructure";
import { useLocationList } from "@/utils/utils";
import React, { useEffect, useState } from "react";

/* =====================
   Reusable UI Components
===================== */

const Card: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="font-semibold text-lg mb-1">{title}</h2>
    <p className="text-sm text-gray-500 mb-6">{description}</p>
    {children}
  </div>
);

const Button: React.FC<{
  label: string;
  variant?: "blue" | "purple";
  onClick?: () => void;
}> = ({ label, variant = "blue", onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-white py-2 rounded-md transition ${variant === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-purple-600 hover:bg-purple-700"
      }`}
  >
    {label}
  </button>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    {...props}
    className="w-full border border-gray-200 rounded-md px-3 py-2"
  />
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className="w-full border border-gray-200 rounded-md px-3 py-2"
  />
);

/* =====================
   i18n Dictionary (EN)
===================== */

const t = {
  dashboard: "Dashboard",
  subtitle: "Manage infrastructure data and generate volume reports.",
  locationTitle: "Search by Location",
  locationDesc: "Filter volumes by administrative area",
  dateTitle: "Search by Date",
  dateDesc: "Filter by construction date",
  locationBtn: "Search",
  dateBtn: "Search",
};

/* =====================
   Main Dashboard Page
===================== */

const Dashboard: React.FC = () => {
  /* ---- State ---- */
  const [locationFilters, setLocationFilters] = useState({
    commune: "",
    quartier: "",
    avenue: "",
  });

  const [dateFilters, setDateFilters] = useState({
    year: "",
    semester: "",
    trimester: "",
    month: "",
    date_from: "",
    date_to: "",
  });

  const [runLocationSearch, setRunLocationSearch] = useState(false);
  const [runDateSearch, setRunDateSearch] = useState(false);

  /* ---- Queries (triggered by button) ---- */
  const {
    data: locationData,
    isFetching: isLocationFetching,
    isError: isLocationError,
    isSuccess: isLocationSuccess,
    isPending: isLocationPending,
  } = useInfrastructureByAdresseLocation(locationFilters, runLocationSearch);

  const {
    data: dateData,
    isFetching: isDateFetching,
    isError: isDateError,
    isSuccess: isDateIsSuccess,
  } = useInfrastructureVolumeByDate(dateFilters, runDateSearch);

  const { data: clientData } = useCustomers();
  const uniqueCommunes = useLocationList(clientData, "commune");
  const uniqueQuartier = useLocationList(clientData, "quartier");
  const uniqueAvenue = useLocationList(clientData, "avenue");
  // const startDate = useLocationList(clientData, "date_from");
  // const startEnd = useLocationList(clientData, "date_to");

  useEffect(() => {
    if (runLocationSearch && (isLocationSuccess || isLocationError)) {
      setRunLocationSearch(false);
    }
  }, [runLocationSearch, isLocationSuccess, isLocationError]);

  const isAnyLocationFilterSelected = Object.values(locationFilters).some(
    (value) => value !== ""
  );

  useEffect(() => {
    if (runDateSearch && (isDateIsSuccess || isDateError)) {
      setRunDateSearch(false);
    }
  }, [runDateSearch, isDateIsSuccess, isDateError]);

  const isAnyDateFilterSelected = Object.values(dateFilters).some(
    (value) => value !== ""
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10 ">
        <h1 className="text-2xl font-semibold mb-1">{t.dashboard}</h1>
        <p className="text-gray-500 mb-8">{t.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Location Card */}
          <Card title={t.locationTitle} description={t.locationDesc}>
            <div className="space-y-4">
              <Select
                onChange={(e) =>
                  setLocationFilters({
                    ...locationFilters,
                    commune: e.target.value,
                  })
                }
              >
                <option value="">Any Commune</option>
                {uniqueCommunes?.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <Select
                onChange={(e) =>
                  setLocationFilters({
                    ...locationFilters,
                    quartier: e.target.value,
                  })
                }
              >
                <option value="">Any Quartier</option>
                {uniqueQuartier.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <Select
                onChange={(e) =>
                  setLocationFilters({
                    ...locationFilters,
                    avenue: e.target.value,
                  })
                }
              >
                <option value="">Any Avenue</option>
                {uniqueAvenue.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              {/* <Button
                label={t.locationBtn}
                onClick={() => setRunLocationSearch(true)}
              /> */}
              <button
                onClick={() => setRunLocationSearch(true)}
                disabled={isLocationFetching || !isAnyLocationFilterSelected}
                className="w-full mt-6 text-white py-2 rounded-md transition bg-blue-600 hover:bg-blue-700"
              >
                {isLocationFetching ? "Chargement..." : t.locationBtn}
              </button>
            </div>
          </Card>

          {/* Date Card */}
          <Card title={t.dateTitle} description={t.dateDesc}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="e.g. 2023"
                onChange={(e) =>
                  setDateFilters({ ...dateFilters, year: e.target.value })
                }
              />
              <Select
                onChange={(e) =>
                  setDateFilters({ ...dateFilters, semester: e.target.value })
                }
              >
                <option value="">Any Semester</option>
              </Select>
              <Select
                onChange={(e) =>
                  setDateFilters({ ...dateFilters, trimester: e.target.value })
                }
              >
                <option value="">Any Trimester</option>
              </Select>
              <Select
                onChange={(e) =>
                  setDateFilters({ ...dateFilters, month: e.target.value })
                }
              >
                <option value="">Any Month</option>
              </Select>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">SPECIFIC DATE RANGE</p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  onChange={(e) =>
                    setDateFilters({
                      ...dateFilters,
                      date_from: e.target.value,
                    })
                  }
                />
                <Input
                  type="date"
                  onChange={(e) =>
                    setDateFilters({ ...dateFilters, date_to: e.target.value })
                  }
                />
              </div>
            </div>

            {/* <Button
              label={t.dateBtn}
              variant="blue"
              onClick={() => setRunDateSearch(true)}

            /> */}
            <button
              onClick={() => setRunDateSearch(true)}
              disabled={isDateFetching || !isAnyDateFilterSelected}
              className="w-full text-white py-2 rounded-md transition bg-blue-600 hover:bg-blue-700"
            >
              {isDateFetching ? "chargemant ..." : t.dateBtn}
            </button>

            {dateData && (
              <p className="text-sm text-gray-600 mt-3">
                Volume: {dateData.total_volume}
              </p>
            )}
          </Card>
        </div>

        <div className="bg-white shadow-xl max-w-7xl h-20 flex justify-center items-center">
          {locationData && (
            <p className=" text-gray-500 font-bold text-md">
              La capacite total de nos citernes de {locationFilters.commune}
              {locationFilters.avenue} {locationFilters.quartier}:{" "}
              {locationData.total_volume} m3
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
