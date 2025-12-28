export type InfrastructureDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export enum allawedTypesInfrastructure {
  infrastructure = "infrastructure",
  bailleur = "bailleur",
  zonecontributive = "zonecontributive",
  inspection = "inspection",
}
