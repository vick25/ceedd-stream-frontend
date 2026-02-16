import { BailleurFormData } from "@/lib/schema";
import { serviceBailleur } from "@/services/bailleur";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBailleurs = () => {
  return useQuery({
    queryFn: async () => serviceBailleur.getBailleurs(),
    queryKey: ["bailleurs"],
  });
};

export const useCreateBailleurs = () => {
  return useMutation({
    mutationFn: async (data: BailleurFormData) =>
      serviceBailleur.createBailleur(data),
    onSuccess: (response) =>
      toast.success("Le bailleur a été crée avec succées"),
    onError: (error) => toast.error("Impossible de créer le bailleur"),
  });
};

export const useUpdateBailleurs = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BailleurFormData }) =>
      serviceBailleur.updateBailleur(id, data),
    onSuccess: (response) =>
      toast.success("Le bailleur a été mis à jour avec succées"),
    onError: (error: any) =>
      toast.error("Impossible de mettre à jour le bailleur"),
  });
};

export const useDeleteBailleurs = () => {
  return useMutation({
    mutationFn: async (id: string) => serviceBailleur.deleteBailleur(id),
    onSuccess: (response) =>
      toast.success("Le bailleur a été supprimé avec succées"),
    onError: (error: any) => toast.error("Impossible de supprimer le bailleur"),
  });
};
