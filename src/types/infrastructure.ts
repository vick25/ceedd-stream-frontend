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
