import { serviceBailleur } from "@/services/bailleur";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBailleurs = () => {
  return useQuery({
    queryFn: serviceBailleur.getBailleurs,
    queryKey: ["bailleurs"],
  });
};
export const useCreateBailleurs = () => {
  return useMutation({
    mutationFn: (data: any) => serviceBailleur.createBailleur(data),
    onSuccess: (response) => {
      toast.success("Le bailleur a été crée avec succées");
    },
    onError: (error) => {
      toast.error("Impossible de créer le bailleur");
    },
  });
};
export const useUpdateBailleurs = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      serviceBailleur.updateBailleur(id, data),
    onSuccess: (response) => {
      toast.success("Le bailleur a été mis à jour avec succées");
    },
    onError: (error: any) => {
      toast.error("Impossible de mettre à jour le bailleur");
    },
  });
};

export const useDeleteBailleurs = () => {
  return useMutation({
    mutationFn: (id: string) => serviceBailleur.deleteBailleur(id),
    onSuccess: (response) => {
      toast.success("Le bailleur a été supprimé avec succées");
    },
    onError: (error: any) => {
      toast.error("Impossible de supprimer le bailleur");
    },
  });
};
