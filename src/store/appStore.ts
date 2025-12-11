import { InfrastructureTypes, User } from "@/types/infrastructure";
import { set } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  searchTerms: string;
  searchResults: InfrastructureTypes[];

  setUser: (user: User | null) => void;
  setHasHydrated: () => void;
  logout: () => void;
  setSearchTerms: (term: string) => void;
  setSearchResults: (results: InfrastructureTypes[]) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        _hasHydrated: false,
        searchTerms: "",
        setSearchTerms: (term) =>
          set({
            searchTerms: term,
          }),
        searchResults: [],
        setSearchResults: (results) =>
          set({
            searchResults: results,
          }),
        setUser: (user) =>
          set(
            {
              user,
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
