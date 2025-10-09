import { create } from 'zustand'
import { Infrastructure, FundingSource } from '@/types/infrastructure'

interface InfrastructureState {
  infrastructures: Infrastructure[]
  fundingSources: FundingSource[]
  setInfrastructures: (infra: Infrastructure[]) => void
  setFundingSources: (sources: FundingSource[]) => void
  addOrUpdate: (infra: Infrastructure) => void
  remove: (id: string) => void
}

export const useInfrastructureStore = create<InfrastructureState>((set, get) => ({
  infrastructures: [],
  fundingSources: [],
  setInfrastructures: (infra) => set({ infrastructures: infra }),
  setFundingSources: (sources) => set({ fundingSources: sources }),
  addOrUpdate: (infra) => {
    const current = get().infrastructures
    const existing = current.find(i => i.id === infra.id)
    const updated = existing 
      ? current.map(i => i.id === infra.id ? { ...infra, updatedAt: new Date().toISOString() } : i)
      : [...current, { ...infra, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
    
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('geoapp:infrastructures', JSON.stringify(updated))
    }
    set({ infrastructures: updated })
  },
  remove: (id) => {
    const updated = get().infrastructures.filter(i => i.id !== id)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('geoapp:infrastructures', JSON.stringify(updated))
    }
    set({ infrastructures: updated })
  },
}))

export function hydrateInfrastructure() {
  if (typeof window !== 'undefined') {
    const infra = window.localStorage.getItem('geoapp:infrastructures')
    const sources = window.localStorage.getItem('geoapp:fundingSources')
    
    if (infra) {
      useInfrastructureStore.getState().setInfrastructures(JSON.parse(infra))
    }
    if (sources) {
      useInfrastructureStore.getState().setFundingSources(JSON.parse(sources))
    }
  }
}
