export type Sex = "M" | "F";

export interface Well {
  id: string;
  lastName: string;
  firstName: string;
  sex: Sex;
  avenue: string;
  quartier?: string;
  commune: string;
  latitude: number;
  longitude: number;
  capacityLiters?: number;
  constructionYear?: number;
  month?: string;
  trimester?: string;
  notes?: string;
}

export interface WellFilters {
  search?: string;
  commune?: string;
  trimester?: string;
  year?: number;
}
