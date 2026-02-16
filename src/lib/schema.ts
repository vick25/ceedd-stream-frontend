import * as z from "zod";

// Bailleur schema
export const bailleurSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  sigle: z.string().optional(),
});

export type BailleurFormData = z.infer<typeof bailleurSchema>;
