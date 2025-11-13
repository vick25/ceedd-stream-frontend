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
