export interface MapFeature {
  id: string;
  lat: number;
  lng: number;
  nom: string;
  type: string;
  location: string;
  lastVerification: string;
  date_construction: string;
  waterVolume: number; // in m3
  maxCapacity: number; // in m3
}

export interface StatItem {
  value: string;
  label: string;
}
