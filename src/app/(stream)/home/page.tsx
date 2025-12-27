"use client";

import { useCustomers } from "@/components/hooks/useCustomer";
import {
  useInfrastructureByAdresseLocation,
  useInfrastructureVolumeByDate,
} from "@/components/hooks/useInfrastructure";
import { Skeleton } from "@/components/ui/skeleton";
// Assurez-vous que resolveDateRange et useLocationList sont exportés depuis le même fichier ou depuis "@/utils/dateResolvers"
import { resolveDateRange, useLocationList } from "@/utils/utils";

import React, { useEffect, useState } from "react";

/* =========================================================================
   UI Components (Utilisés pour la clarté et la réutilisation)
========================================================================= */

const Card: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h2 className="font-semibold text-lg mb-1">{title}</h2>
    <p className="text-sm text-gray-500 mb-6">{description}</p>
    {children}
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    {...props}
    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
  />
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
  />
);

// NOUVEAU COMPOSANT : Carte de Résultat pour afficher le volume (Design Pro)
const ResultCard: React.FC<{
  title: string;
  volume: number | null | undefined;
  details: string;
  color: "blue" | "green";
}> = ({ title, volume, details, color }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center h-40 border-t-4 ${
      color === "blue" ? "border-blue-500" : "border-green-500"
    }`}
  >
    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
    <h3 className="text-4xl font-extrabold text-gray-800 mb-3">
      {volume !== null ? `${volume} m³` : "N/A"}
    </h3>
    <p className="text-xs text-gray-400 text-center">{details}</p>
  </div>
);

// NOUVEAU COMPOSANT : Carte de Message (Chargement, Erreur, Absence de Données)
const MessageCard: React.FC<{
  message: string;
  type: "loading" | "error" | "no-data";
}> = ({ message, type }) => {
  let icon: React.ReactNode;
  let colorClass: string;
  let borderClass: string;

  switch (type) {
    case "loading":
      icon = (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
      colorClass = "text-blue-600";
      borderClass = "border-blue-300";
      break;
    case "error":
      icon = <span className="text-xl mr-2">🚨</span>;
      colorClass = "text-red-600";
      borderClass = "border-red-300";
      break;
    case "no-data":
    default:
      icon = <span className="text-xl mr-2">🔍</span>;
      colorClass = "text-yellow-700";
      borderClass = "border-yellow-300";
      break;
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center h-40 border-t-4 ${borderClass}`}
    >
      <p className={`text-lg font-medium ${colorClass} flex items-center`}>
        {icon}
        {message}
      </p>
    </div>
  );
};

/* =========================================================================
   Data & i18n
========================================================================= */

const t = {
  dashboard: "Dashboard",
  subtitle: "Gestion des infrastructures et génération de rapports de volume.",
  locationTitle: "Recherche par Localisation",
  locationDesc: "Filtrer les volumes par zone administrative.",
  dateTitle: "Recherche par Date",
  dateDesc: "Filtrer par période de construction.",
  locationBtn: "Rechercher (Localisation)",
  dateBtn: "Rechercher (Période)",
};

const dateOptions = {
  months: [
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ],
  trimesters: [
    { value: "1", label: "T1 (Jan-Mar)" },
    { value: "2", label: "T2 (Avr-Juin)" },
    { value: "3", label: "T3 (Juil-Sep)" },
    { value: "4", label: "T4 (Oct-Déc)" },
  ],
  semesters: [
    { value: "1", label: "S1 (Jan-Juin)" },
    { value: "2", label: "S2 (Juil-Déc)" },
  ],
};

/* =========================================================================
   Main Dashboard Page
========================================================================= */

const Dashboard: React.FC = () => {
  /* ---- State Management ---- */
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

  /* ---- TanStack Query Hooks ---- */
  const {
    data: locationData,
    isFetching: isLocationFetching,
    isError: isLocationError,
    isSuccess: isLocationSuccess,
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

  /* ---- Utility Functions ---- */

  // Ajoutez ceci dans le corps de votre composant Dashboard :

  useEffect(() => {
    if (isDateIsSuccess) {
      console.log("Date Query SUCCESS. Data:", dateData);
    }
    if (isDateFetching) {
      console.log("Date Query FETCHING...");
    }
    if (isDateError) {
      console.error("Date Query ERROR!");
    }
    if (dateData) {
      console.log("Current dateData:", dateData);
      console.log("Has Volume Data:", hasVolumeData(dateData));
    }
  }, [isDateIsSuccess, isDateFetching, isDateError, dateData]);

  // ... le reste du code Dashboard ...

  useEffect(() => {
    if (runLocationSearch && (isLocationSuccess || isLocationError)) {
      setRunLocationSearch(false);
    }
  }, [runLocationSearch, isLocationSuccess, isLocationError]);

  useEffect(() => {
    if (runDateSearch && (isDateIsSuccess || isDateError)) {
      setRunDateSearch(false);

      // Réinitialiser les filtres de période/année pour une nouvelle sélection propre
      if (isDateIsSuccess) {
        setDateFilters((prev) => ({
          ...prev,
          semester: "",
          trimester: "",
          month: "",
        }));
      }
    }
  }, [runDateSearch, isDateIsSuccess, isDateError]);

  // Vérifie si un filtre est sélectionné pour activer le bouton de recherche
  const isAnyLocationFilterSelected = Object.values(locationFilters).some(
    (value) => value !== ""
  );

  const isAnyDateFilterSelected = Object.values(dateFilters).some(
    (value) => value !== ""
  );

  /**
   * Vérifie si le résultat de la requête est valide (existe et volume > 0).
   */
  const hasVolumeData = (data: any) => {
    return data && typeof data.total_volume !== null && data.total_volume > 0;
  };

  /* ---- Handlers ---- */

  const handleDateSearch = () => {
    const resolvedDates = resolveDateRange(dateFilters); // Fonction importée de utils/dateResolvers

    if (resolvedDates) {
      // Mettre à jour l'état dateFilters avec la plage de dates résolue
      setDateFilters((prev) => ({
        ...prev,
        date_from: resolvedDates.date_from,
        date_to: resolvedDates.date_to,
      }));

      setRunDateSearch(true);
    } else {
      alert(
        "Veuillez sélectionner au moins une année pour les filtres de période, ou renseignez la plage de dates complète."
      );
    }
  };

  /* =========================================================================
     Rendu Conditionnel des Résultats (Logique unifiée)
  ========================================================================= */

  const renderLocationResults = () => {
    const searchAttempted = isAnyLocationFilterSelected;

    // 1. État de Succès (Volume > 0)
    // Nous rendons le succès prioritaire sur toute autre vérification, car si les données sont là, elles doivent s'afficher.
    if (hasVolumeData(locationData)) {
      const { commune, quartier, avenue } = locationFilters;
      const details = `Filtres: ${commune || "Tous"}, ${quartier || "Tous"}, ${
        avenue || "Toutes"
      }`;
      return (
        <ResultCard
          title={`Capacité Totale (${commune || "Global"})`}
          volume={locationData?.total_volume}
          details={details}
          color="blue"
        />
      );
    }

    // À partir d'ici, si la recherche n'a pas été lancée ou si elle est encore en cours, on sort.
    if (!searchAttempted || isLocationFetching) {
      if (isLocationFetching) {
        return (
          <MessageCard
            type="loading"
            message="Recherche des données de localisation..."
          />
        );
      }
      return null;
    }

    // 2. État d'Erreur (La recherche s'est terminée avec une erreur)
    if (isLocationError) {
      return (
        <MessageCard
          type="error"
          message="Erreur lors de la récupération des données de localisation."
        />
      );
    }

    // 3. État d'Absence de Données (La recherche a réussi, mais hasVolumeData est faux)
    // Cette condition s'exécute si isLocationSuccess est vrai ET que hasVolumeData est faux
    if (isLocationSuccess) {
      return (
        <MessageCard
          type="no-data"
          message="Aucun volume d'infrastructure trouvé pour ces critères."
        />
      );
    }

    return null;
  };

  const renderDateResults = () => {
    const searchAttempted = isAnyDateFilterSelected;

    // 1. État de Succès (Volume > 0)
    if (hasVolumeData(dateData)) {
      const details = `Période du ${dateFilters.date_from || "N/A"} au ${
        dateFilters.date_to || "N/A"
      }`;
      return (
        <ResultCard
          title="Volume Total par Période"
          volume={dateData?.total_volume}
          details={details}
          color="green"
        />
      );
    }

    // À partir d'ici, si la recherche n'a pas été lancée ou si elle est encore en cours, on sort.
    if (!searchAttempted || isDateFetching) {
      if (isDateFetching) {
        return (
          <MessageCard
            type="loading"
            message="Recherche des données de volume par date..."
          />
        );
      }
      return null;
    }

    // 2. État d'Erreur
    if (isDateError) {
      return (
        <MessageCard
          type="error"
          message="Erreur lors de la récupération des données de date."
        />
      );
    }

    // 3. État d'Absence de Données
    if (isDateIsSuccess) {
      return (
        <MessageCard
          type="no-data"
          message="Aucun volume d'infrastructure trouvé pour cette période."
        />
      );
    }

    return null;
  };
  /* =========================================================================
     MAIN RENDER
  ========================================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10 ">
        {/* En-tête */}
        <h1 className="text-3xl font-bold text-gray-800 mb-1">{t.dashboard}</h1>
        <p className="text-gray-500 mb-8">{t.subtitle}</p>

        {/* SECTION FILTRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Location Card */}
          <Card title={t.locationTitle} description={t.locationDesc}>
            <div className="space-y-4">
              {isLocationFetching ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Select
                  value={locationFilters.commune}
                  onChange={(e) =>
                    setLocationFilters({
                      ...locationFilters,
                      commune: e.target.value,
                    })
                  }
                >
                  <option value=""> Selectionnez Commune</option>
                  {uniqueCommunes?.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              )}
              {isLocationFetching ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Select
                  value={locationFilters.quartier}
                  onChange={(e) =>
                    setLocationFilters({
                      ...locationFilters,
                      quartier: e.target.value,
                    })
                  }
                >
                  <option value="">Selectionnez Quartier</option>
                  {uniqueQuartier.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              )}

              {isLocationFetching ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Select
                  value={locationFilters.avenue}
                  onChange={(e) =>
                    setLocationFilters({
                      ...locationFilters,
                      avenue: e.target.value,
                    })
                  }
                >
                  <option value=""> Selectionnez Avenue</option>
                  {uniqueAvenue.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              )}

              <button
                onClick={() => setRunLocationSearch(true)}
                disabled={isLocationFetching || !isAnyLocationFilterSelected}
                className="w-full mt-6 text-white py-2.5 rounded-lg transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                type="number"
                value={dateFilters.year}
                onChange={(e) =>
                  setDateFilters({ ...dateFilters, year: e.target.value })
                }
              />
              <Select
                value={dateFilters.semester}
                onChange={(e) =>
                  setDateFilters({
                    ...dateFilters,
                    semester: e.target.value,
                    trimester: "",
                    month: "",
                  })
                }
              >
                <option value="">Any Semester</option>
                {dateOptions.semesters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                value={dateFilters.trimester}
                onChange={(e) =>
                  setDateFilters({
                    ...dateFilters,
                    trimester: e.target.value,
                    semester: "",
                    month: "",
                  })
                }
              >
                <option value="">Any Trimester</option>
                {dateOptions.trimesters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                value={dateFilters.month}
                onChange={(e) =>
                  setDateFilters({
                    ...dateFilters,
                    month: e.target.value,
                    semester: "",
                    trimester: "",
                  })
                }
              >
                <option value="">Any Month</option>
                {dateOptions.months.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">
                PLAGE DE DATE SPÉCIFIQUE (Priorité la plus haute)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={dateFilters.date_from}
                  onChange={(e) =>
                    setDateFilters({
                      ...dateFilters,
                      date_from: e.target.value,
                      year: "",
                      semester: "",
                      trimester: "",
                      month: "",
                    })
                  }
                />
                <Input
                  type="date"
                  value={dateFilters.date_to}
                  onChange={(e) =>
                    setDateFilters({
                      ...dateFilters,
                      date_to: e.target.value,
                      year: "",
                      semester: "",
                      trimester: "",
                      month: "",
                    })
                  }
                />
              </div>
            </div>

            <button
              onClick={handleDateSearch}
              disabled={isDateFetching || !isAnyDateFilterSelected}
              className="w-full text-white py-2.5 rounded-lg transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isDateFetching ? "Chargement..." : t.dateBtn}
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Période demandée: {dateFilters.date_from || "N/A"} au{" "}
              {dateFilters.date_to || "N/A"}
            </p>
          </Card>
        </div>

        {/* SECTION RÉSULTATS */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Synthèse des Résultats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Résultat Localisation */}
          {renderLocationResults()}

          {/* Résultat Date */}
          {renderDateResults()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
