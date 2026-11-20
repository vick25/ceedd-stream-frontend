import {
  clearSession,
  getToken,
  isTokenValid,
  redirectToLogin,
} from "@/lib/session";
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config: any) => {
  const token = getToken();
  if (token) {
    // Jeton expiré : inutile d'envoyer la requête, on termine la session.
    if (!isTokenValid(token)) {
      clearSession();
      redirectToLogin();
      return Promise.reject(new axios.CanceledError("Session expirée"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // "?." : sans réponse du serveur (coupure réseau, timeout, CORS),
    // error.response est undefined ; avant, la ligne plantait ici.
    const status = error.response?.status;
    // Un 401 sur la route de connexion = mauvais mot de passe : on laisse la
    // page de login afficher son message au lieu de la recharger.
    const isLoginRequest = error.config?.url?.includes("/token/");

    if (status === 401 && !isLoginRequest) {
      // jeton expiré ou invalide : on nettoie la session complète
      clearSession();
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default API;
