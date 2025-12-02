// export const isAUthentificated = () => {
//   // Vérifie si nous sommes dans un environnement de navigateur (où 'window' et 'localStorage' existent)
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("ceeAuth-token");

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
