import { useMemo } from "react";

interface DateFilters {
  year: string;
  semester: string;
  trimester: string;
  month: string;
  date_from: string;
  date_to: string;
}

interface ResolvedDateRange {
  date_from: string;
  date_to: string;
}

export const getEndDateOfMonth = (year: number, month: number): string => {
  const date = new Date(year, month, 0);
  return `${year}-${String(month).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

export const resolveDateRange = (
  filters: DateFilters
): ResolvedDateRange | null => {
  const { year, semester, trimester, month, date_from, date_to } = filters;
  if (date_from && date_to) {
    return { date_from, date_to };
  }
  if (!year) {
    return null;
  }
  const y = parseInt(year, 10);
  let resolvedStart: string | null = null;
  let resolvedEnd: string | null = null;

  if (month) {
    const m = parseInt(month, 10);
    resolvedStart = `${y}-${month}-01`;
    resolvedEnd = getEndDateOfMonth(y, m);
  } else if (trimester) {
    switch (trimester) {
      case "1":
        resolvedStart = `${y}-01-01`;
        resolvedEnd = getEndDateOfMonth(y, 3);
        break;
      case "2":
        resolvedStart = `${y}-04-01`;
        resolvedEnd = getEndDateOfMonth(y, 6);
        break;
      case "3":
        resolvedStart = `${y}-07-01`;
        resolvedEnd = getEndDateOfMonth(y, 9);
        break;
      case "4":
        resolvedStart = `${y}-10-01`;
        resolvedEnd = getEndDateOfMonth(y, 12);
        break;
    }
  } else if (semester) {
    switch (semester) {
      case "1":
        resolvedStart = `${y}-01-01`;
        resolvedEnd = getEndDateOfMonth(y, 6);
        break;
      case "2":
        resolvedStart = `${y}-07-01`;
        resolvedEnd = getEndDateOfMonth(y, 12);
        break;
    }
  } else {
    resolvedStart = `${y}-01-01`;
    resolvedEnd = `${y}-12-31`;
  }

  return resolvedStart && resolvedEnd
    ? { date_from: resolvedStart, date_to: resolvedEnd }
    : null;
};

export const displayDate = (dateObject: Date | string): string => {
  // ... (implémentation de formatDateToInput)
  if (!dateObject) return "";
  const date =
    typeof dateObject === "string" ? new Date(dateObject) : dateObject;
  if (isNaN(date.getTime())) return "";

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

interface ClientData {
  results?: Array<Record<string, any>>; // Tableau d'objets bruts
}

export const useLocationList = (
  clientData: ClientData | undefined,
  filterKey: string
): string[] => {
  const uniqueClientList = useMemo(() => {
    // 1. Vérification initiale des données
    if (!clientData || !clientData.results) {
      return [];
    }

    const KEY_TO_FILTER = filterKey;

    // Map pour stocker [Nom_Commune_Minuscule] -> Objet_Client_Entier
    const uniqueMap = new Map();

    clientData.results.forEach((clientObj: any) => {
      const value = clientObj[KEY_TO_FILTER]; // Récupère la valeur de 'commune'

      if (value && typeof value === "string") {
        // Standardise la clé (minuscule) pour la déduplication
        const normalizedValue = value.trim().toLowerCase();

        // Si cette version normalisée n'a pas été vue, on l'ajoute
        if (!uniqueMap.has(normalizedValue)) {
          uniqueMap.set(normalizedValue, clientObj);
        }
      }
      // Si 'value' est null, undefined ou vide, nous ignorons l'objet
    });

    // 2. Extrait uniquement les noms de commune (en conservant la première casse rencontrée)
    // Map.values() donne les objets, puis on map pour extraire le nom de la commune.
    const finalUniqueCommunes = Array.from(uniqueMap.values()).map(
      (obj) => obj[KEY_TO_FILTER]
    );

    // 3. Optionnel : Trier les résultats
    return finalUniqueCommunes.sort();
  }, [clientData]);

  return uniqueClientList;
};

//--- Formatage de la date pour l'affichage lisible en français pour l'inspection de l'infrastructure ---
export const formatDate = (dateStr: any) => {
  const date = new Date(dateStr);
  // Vérifie si la date est valide (getTime ne renvoie pas NaN)
  return !isNaN(date.getTime())
    ? date.toISOString().split("T")[0]
    : "Aucune inspection";
};
