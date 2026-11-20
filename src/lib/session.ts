// Gestion centralisée de la session côté navigateur.
// Avant, les clés "ceeAuth-token" et "ceedd" étaient écrites en dur dans
// plusieurs fichiers : un oubli (comme au logout) laissait une session à moitié
// effacée. Tout passe maintenant par ce fichier.

export const TOKEN_KEY = "ceeAuth-token"; // jeton JWT d'accès
export const STORE_KEY = "ceedd"; // store Zustand persisté (user, isAuthenticated)

// Marge de sécurité : on considère le jeton expiré 30 s avant son expiration
// réelle, pour ne pas envoyer une requête qui arriverait expirée au serveur.
const EXPIRY_MARGIN_SECONDS = 30;

const isBrowser = () => typeof window !== "undefined";

export const getToken = (): string | null =>
  isBrowser() ? localStorage.getItem(TOKEN_KEY) : null;

export const setToken = (token: string) => {
  if (isBrowser()) localStorage.setItem(TOKEN_KEY, token);
};

// Un JWT = "entête.payload.signature", chaque partie en base64url.
// On lit le champ "exp" (date d'expiration en secondes) du payload.
// ⚠️ On ne VÉRIFIE PAS la signature : c'est le rôle du serveur. On lit juste
// la date pour déconnecter l'utilisateur à temps côté interface.
export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null; // jeton illisible
  }
};

// true si un jeton existe, est lisible et n'est pas expiré.
export const isTokenValid = (token: string | null = getToken()): boolean => {
  if (!token) return false;
  const exp = getTokenExpiry(token);
  if (exp === null) return false; // illisible ou sans date : on ne lui fait pas confiance
  return Date.now() / 1000 < exp - EXPIRY_MARGIN_SECONDS;
};

// Millisecondes restantes avant expiration (0 si déjà expiré / absent).
export const msUntilExpiry = (token: string | null = getToken()): number => {
  const exp = token ? getTokenExpiry(token) : null;
  if (exp === null) return 0;
  return Math.max(0, (exp - EXPIRY_MARGIN_SECONDS) * 1000 - Date.now());
};

// Efface TOUT ce qui identifie l'utilisateur dans le navigateur.
export const clearSession = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STORE_KEY);
};

// Redirige vers /login sauf si on y est déjà (évite une boucle de rechargement).
export const redirectToLogin = () => {
  if (isBrowser() && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
