export interface MapFeature {
  id: string;
  lat: number;
  lng: number;
  type: string;
  location: string;
  state: "Functional" | "Needs Repair" | "Critical";
  lastVerification: string;
  fundingPartner: string;
  waterVolume: number; // in m3
  maxCapacity: number; // in m3
}

export interface StatItem {
  value: string;
  label: string;
}
