export type Locale = "fr" | "en";

export const translations = {
  fr: {
    navigation: {
      home: "Accueil",
      dashboard: "Tableau de bord",
      infrastructures: "Infrastructures",
      map: "Carte",
      questions: "Questions",
      donations: "Dons",
      about: "À propos",
    },
    infrastructure: {
      types: {
        well: "Puits",
        cistern: "Citerne",
        retention_basin: "Bassin de rétention",
        lost_well: "Puits perdu",
        dam: "Barrage",
        vegetation: "Végétation",
        drainage: "Canalisation",
        contributive_zone: "Zone contributive",
      },
      status: {
        good: "Bon",
        medium: "Moyen",
        bad: "Mauvais",
      },
      details: {
        capacity: "Capacité",
        constructionYear: "Année de construction",
        lastInspection: "Dernière vérification",
        contributiveZone: "Zone contributive",
        funding: "Financement",
      },
    },
    dashboard: {
      totalInfrastructures: "Total infrastructures",
      coveragePercentage: "% de couverture",
      typeInfrastructures: "Total type Infrastructure",
      totalClients: "Total de clients",
      totalInvestment: "Investissement total",
    },
  },
  en: {
    navigation: {
      home: "Home",
      dashboard: "Dashboard",
      infrastructures: "Infrastructures",
      map: "Map",
      questions: "Questions",
      donations: "Donations",
      about: "About",
    },
    infrastructure: {
      types: {
        well: "Well",
        cistern: "Cistern",
        retention_basin: "Retention Basin",
        lost_well: "Lost Well",
        dam: "Dam",
        vegetation: "Vegetation",
        drainage: "Drainage",
        contributive_zone: "Contributive Zone",
      },
      status: {
        good: "Good",
        medium: "Medium",
        bad: "Bad",
      },
      details: {
        capacity: "Capacity",
        constructionYear: "Construction Year",
        lastInspection: "Last Inspection",
        contributiveZone: "Contributive Zone",
        funding: "Funding",
      },
    },
    dashboard: {
      totalInfrastructures: "Total Infrastructures",
      coveragePercentage: "Coverage %",
      typeInfrastructures: "Total type Infrastructure",
      totalCapacity: "Total Capacity",
      totalInvestment: "Total Investment",
      totalClients: "Total Customer",
    },
  },
} as const;

export function useTranslations(locale: Locale) {
  return translations[locale];
}

export function t(key: string, locale: Locale): string {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
