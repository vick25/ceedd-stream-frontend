// import type { FundingSource } from "./infrastructure";
export type FundingSourceType = "donor" | "public" | "ngo";

export interface FundingSource {
  id: string;
  name: string;
  type: FundingSourceType;
  website: string;
}
export type InfrastructureType =
  | "well"
  | "cistern"
  | "retention_basin"
  | "vegetation"
  | "drainage"
  | "lost_well"
  | "dam"
  | "contributive_zone";

export type InfrastructureStatus = "good" | "medium" | "bad";

export interface Infrastructure {
  id: string;
  name: string;
  type: InfrastructureType;
  status: InfrastructureStatus;
  owner: string;
  contactPerson: string;
  latitude: number;
  longitude: number;
  avenue?: string;
  quartier?: string;
  commune: string;
  capacity: number;
  capacityUnit: string;
  constructionYear: number;
  lastInspectionDate: string;
  contributiveZone: string;
  contributiveArea: number;
  fundingSource: FundingSource;
  totalCost: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface InfrastructureTypes {
  id: string;
  nom: string;
  type_infrastructure: string;
  date_construction: string;
  latitude: string;
  longitude: string;
  capacite: string;
  unite: string;
  // zone: string;
  client: string;
}
export interface zone_contributive {
  id: string;
  nom: string;
  superficie: number;
  etat_ravin: string;
  geom: string;
  shapefile_id: string;
}
export interface bailleur {
  id: string;
  nom: string;
}
export interface finance {
  id: string;
  infrastructure_id: string;
  date_financement: string;
  montant: String;
}
export interface type_infrastructure {
  id: string;
  nom: string;
  symbole: string;
}
export interface inspection {
  id: string;
  infrastructure_id: string;
  date: string;
  etat: string;
  inspecteur: string;
  commentaire: string;
}
export interface photo {
  id: string;
  entite_type: string;
  entite_id: string;
  url: string;
  description: string;
  date_prise: string;
}
export interface client {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  avenue: string;
  quartier: string;
  commune: string;
}
export interface utilisateur {
  id: string;
  nom: string;
  email: string;
  mot_de_passe: string;
  role_id: string;
}
export interface role {
  id: string;
  role: Role_enum;
}
export enum Role_enum {
  admin,
  contributeur,
  lecteur,
}

export interface Donation {
  id: string;
  infrastructureId: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail?: string;
  message?: string;
  donatedAt: string;
  isAnonymous: boolean;
}
export interface CitizenQuestion {
  id: string;
  infrastructureId: string;
  question: string;
  askedBy: string;
  askedAt: string;
  email?: string;
  answer?: string;
}
