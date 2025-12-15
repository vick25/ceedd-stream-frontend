// export const isAUthentificated = () => {
//   // Vérifie si nous sommes dans un environnement de navigateur (où 'window' et 'localStorage' existent)
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("ceeAuth-token");

import { useMemo } from "react";

//     // Si le token existe, on retourne true
//     return !!token && token.trim() !== "";
//   }

//   // Si nous sommes dans l'environnement de rendu côté serveur, on considère que l'utilisateur est déconnecté
//   // (ou que l'état d'authentification ne peut pas encore être déterminé)
//   return false;
// };

// export function displayDate(date: string) {
//   const dateString = date;
//   const objetDate = new Date(dateString);
//   const options = {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   } as const;

//   const formattedDate = objetDate.toLocaleDateString("fr-FR", options);
//   return formattedDate;
// }

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

export const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dcnediean/image/upload";

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
