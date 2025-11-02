import { User } from "@/types/infrastructure";
import { set } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  setUser: (user: User) => void;
  setHasHydrated: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        _hasHydrated: false,
        setUser: (user) =>
          set(
            {
              user: null,
              isAuthenticated: !!user,
            },
            false,
            "setUser"
          ),
        logout: () =>
          set({ user: null, isAuthenticated: false }, false, "logout"),
        setHasHydrated: () =>
          set({ _hasHydrated: true }, false, "setHasHydrated"),
      }),
      {
        name: "ceedd",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated();
        },
      }
    )
  )
);
