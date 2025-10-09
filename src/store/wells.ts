import { create } from 'zustand'
import { Well } from '@/types/well'
import { loadWells, saveWells, upsertWell, deleteWell } from '@/lib/storage'

interface WellsState {
  wells: Well[]
  setWells: (w: Well[]) => void
  addOrUpdate: (w: Well) => void
  remove: (id: string) => void
}

export const useWellsStore = create<WellsState>((set) => ({
  wells: [],
  setWells: (w) => set({ wells: w }),
  addOrUpdate: (w) => set({ wells: upsertWell(w) }),
  remove: (id) => set({ wells: deleteWell(id) }),
}))

export function hydrateWells() {
  const wells = loadWells()
  useWellsStore.getState().setWells(wells)
}


