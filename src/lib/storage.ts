import { Well } from '@/types/well'

const STORAGE_KEY = 'geoapp:wells'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function loadWells(): Well[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Well[]) : []
  } catch {
    return []
  }
}

export function saveWells(wells: Well[]): void {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wells))
}

export function upsertWell(well: Well): Well[] {
  const wells = loadWells()
  const idx = wells.findIndex(w => w.id === well.id)
  if (idx >= 0) {
    wells[idx] = well
  } else {
    wells.push(well)
  }
  saveWells(wells)
  return wells
}

export function deleteWell(id: string): Well[] {
  const wells = loadWells().filter(w => w.id !== id)
  saveWells(wells)
  return wells
}


