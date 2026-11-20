"use client";

import Loader from "@/components/Loader";
import {
  clearSession,
  isTokenValid,
  msUntilExpiry,
} from "@/lib/session";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

// Protège TOUT le dashboard depuis un seul endroit (le layout), au lieu de
// compter sur chaque page pour faire sa propre vérification.
//
// Rappel : c'est une protection d'interface. Le JavaScript du dashboard reste
// téléchargeable par n'importe qui ; ce qui protège réellement les DONNÉES,
// c'est l'API qui refuse les requêtes sans jeton valide.
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { _hasHydrated, isAuthenticated, logout } = useAppStore();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Attendre que Zustand ait relu le localStorage, sinon isAuthenticated
    // vaut false pendant un instant et on déconnecterait tout le monde.
    if (!_hasHydrated) return;

    // Les deux conditions sont exigées : le store dit "connecté" ET le jeton
    // est valide. Modifier le store à la main dans les DevTools ne suffit plus.
    if (!isAuthenticated || !isTokenValid()) {
      clearSession();
      logout();
      router.replace("/login");
      return;
    }
    setAllowed(true);

    // Déconnexion automatique au moment où le jeton expire, même si
    // l'utilisateur ne fait aucune action (onglet laissé ouvert).
    const timer = setTimeout(() => {
      clearSession();
      logout();
      router.replace("/login");
    }, msUntilExpiry());
    return () => clearTimeout(timer);
  }, [_hasHydrated, isAuthenticated, logout, router]);

  if (!allowed) return <Loader />;
  return <>{children}</>;
}
