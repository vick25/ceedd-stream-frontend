import { Infrastructure, FundingSource } from '@/types/infrastructure'

export const fundingSources: FundingSource[] = [
  {
    id: 'fs1',
    name: 'Banque Mondiale',
    type: 'donor',
    website: 'https://worldbank.org'
  },
  {
    id: 'fs2',
    name: 'Gouvernement RDC',
    type: 'public',
    website: 'https://gouv.cd'
  },
  {
    id: 'fs3',
    name: 'UNICEF',
    type: 'ngo',
    website: 'https://unicef.org'
  }
]

export const initialInfrastructures: Infrastructure[] = [
  {
    id: 'inf1',
    name: 'Puits Wembo (Eglise ACNA)',
    type: 'well',
    status: 'good',
    owner: 'Eglise ACNA',
    contactPerson: 'Boniface',
    latitude: -4.4434378,
    longitude: 15.3146532,
    avenue: 'Kiswaka',
    quartier: 'Mama yemo',
    commune: 'Mont Ngafula',
    capacity: 9,
    capacityUnit: 'm3',
    constructionYear: 2023,
    lastInspectionDate: '2024-01-15',
    contributiveZone: 'Zone A',
    contributiveArea: 2500,
    fundingSource: fundingSources[0],
    totalCost: 15000,
    currency: 'USD',
    notes: 'Puits fonctionnel avec système de pompage manuel',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'inf2',
    name: 'Citerne MULUMBA',
    type: 'cistern',
    status: 'medium',
    owner: 'Privé',
    contactPerson: 'Celet',
    latitude: -4.4433351,
    longitude: 15.31377799,
    avenue: 'Tshiswaka 30',
    commune: 'Mont Ngafula',
    capacity: 12,
    capacityUnit: 'm3',
    constructionYear: 2023,
    lastInspectionDate: '2023-12-01',
    contributiveZone: 'Zone B',
    contributiveArea: 1800,
    fundingSource: fundingSources[1],
    totalCost: 8000,
    currency: 'USD',
    notes: 'Nécessite maintenance',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z'
  },
  {
    id: 'inf3',
    name: 'Bassin de rétention TAKOY',
    type: 'retention_basin',
    status: 'good',
    owner: 'Commune',
    contactPerson: 'Michel',
    latitude: -4.4432000,
    longitude: 15.3140000,
    avenue: 'Tshiswaka 43',
    quartier: 'ngafani',
    commune: 'Mont Ngafula',
    capacity: 500,
    capacityUnit: 'm3',
    constructionYear: 2023,
    lastInspectionDate: '2024-02-01',
    contributiveZone: 'Zone C',
    contributiveArea: 5000,
    fundingSource: fundingSources[2],
    totalCost: 25000,
    currency: 'USD',
    notes: 'Bassin de rétention pour eaux pluviales',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'inf4',
    name: 'Zone de végétation MIKULU',
    type: 'vegetation',
    status: 'good',
    owner: 'Public',
    contactPerson: 'Yanki',
    latitude: -4.4440000,
    longitude: 15.3150000,
    avenue: 'boboliko 52',
    quartier: 'Kimvula',
    commune: 'Selembao',
    capacity: 2000,
    capacityUnit: 'm2',
    constructionYear: 2022,
    lastInspectionDate: '2024-01-20',
    contributiveZone: 'Zone D',
    contributiveArea: 2000,
    fundingSource: fundingSources[1],
    totalCost: 12000,
    currency: 'USD',
    notes: 'Zone de végétation pour infiltration des eaux',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'inf5',
    name: 'Système de drainage LWENJOKO',
    type: 'drainage',
    status: 'bad',
    owner: 'Privé',
    contactPerson: 'Levi\'s',
    latitude: -4.4450000,
    longitude: 15.3160000,
    avenue: 'De la montagne 39',
    quartier: 'Heradi',
    commune: 'Mont-ngafula',
    capacity: 800,
    capacityUnit: 'm3',
    constructionYear: 2021,
    lastInspectionDate: '2023-11-15',
    contributiveZone: 'Zone E',
    contributiveArea: 3200,
    fundingSource: fundingSources[0],
    totalCost: 18000,
    currency: 'USD',
    notes: 'Système de drainage bouché, nécessite réparation urgente',
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z'
  }
]

export function ensureSeed() {
  if (typeof window !== 'undefined') {
    const existing = window.localStorage.getItem('geoapp:infrastructures')
    if (!existing) {
      window.localStorage.setItem('geoapp:infrastructures', JSON.stringify(initialInfrastructures))
      window.localStorage.setItem('geoapp:fundingSources', JSON.stringify(fundingSources))
    }
  }
}


