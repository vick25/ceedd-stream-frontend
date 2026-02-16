import { etat_ravin, inspection } from "@/types/infrastructure";
import * as z from "zod";

// Bailleur schema
export const bailleurSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  sigle: z.string().optional(),
});

export type BailleurFormData = z.infer<typeof bailleurSchema>;

// Client
export const clientSchema = z.object({
  nom: z.string().trim().min(3, "Le nom doit contenir au moins 3 caractères."),
  postnom: z.string().trim().optional(),
  prenom: z.string().trim().optional(),
  sexe: z.string().min(1, "Le sexe est requis").optional(),
  titre: z.string().trim().optional(),
  engagement: z.string().trim().optional(),
  avenue: z.string().trim().optional(),
  quartier: z.string().trim().optional(),
  numero: z.string().trim().optional(),
  telephone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  commune: z.string().trim().min(1, "Veuillez veuillez entrer une commune."),
});

export type ClientFormData = z.infer<typeof clientSchema>;

// Infrastructures
export const infrastructureSchema = z.object({
  nom: z.string().trim().min(3, "Le nom doit contenir au moins 3 caractères"),
  type_infrastructure_id: z
    .string()
    .trim()
    .min(1, "Le type d'infrastructure est requis"),
  date_construction: z.string().min(1, "La date de construction est requise"),
  latitude: z.string().trim().min(1, "La latitude est requise"),
  longitude: z.string().trim().min(1, "La longitude est requise"),
  capacite: z.string().trim().min(1, "La capacité est requise"),
  unite: z.string().trim().min(1, "L'unité est requise"),
  zone: z.string().optional(),
  client_id: z.string().min(1, "Veuillez sélectionner un client."),
});

export type InfrastructureFormData = z.infer<typeof infrastructureSchema>;

// Inspections
export const inspectionSchema = z.object({
  date: z.string().min(3, "Le date doit contenir au moins 3 caractères"),
  etat: z
    .string()
    .refine((val) => Object.values(inspection).includes(val as inspection), {
      message: "Veuillez sélectionner un état valide.",
    }),
  inspecteur: z.string().optional(),
  commentaire: z.string().min(1, "Le commentaire est requis").optional(),
  prochain_controle: z.string().optional(),
  infrastructure_id: z.string().min(1, "La capacité est requise").optional(),
});

export type InspectionFormData = z.infer<typeof inspectionSchema>;

// Zones
export const zoneSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  superficie: z.string().optional(),
  etat_ravin: z
    .string()
    .refine((val) => Object.values(etat_ravin).includes(val as etat_ravin), {
      message: "Veuillez sélectionner un état de ravin valide.",
    }),
  description: z.string().optional(),
  geom: z.string().optional(),
  shapefile_id: z.string().optional(),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;
