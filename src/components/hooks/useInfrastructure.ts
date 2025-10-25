import { serviceinfrastructure } from "@/services/infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetInfrastructure = () => {
  return useMutation({
    mutationFn: serviceinfrastructure.getInfrastructure,
    onSuccess: (response: any) => {},
  });
};

export const useCreateInfrastructure = () => {
  return useMutation({
    mutationFn: (data: any) => serviceinfrastructure.createInfrastructure(data),
    onSuccess: (response) => {
      toast.success("Infrastructure créée avec succès");
    },
    onError: (error) => {
      toast.success("Impossible de créer l'infrastructure");
    },
  });
};
export const useUpdateInfrastructure = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: any }) =>
      serviceinfrastructure.updateInfrastructure(data, id),
    onSuccess: (response) => {
      console.log(response);
      toast.success("Mise à jour de l'infrastructure reussi");
    },
    onError: (error) => {
      toast.error("Impossible de modifier l'infrastructures");
    },
  });
};
export const useInfrastructures = () => {
  return useQuery({
    queryKey: ["infrastructures"],
    queryFn: () => serviceinfrastructure.getInfrastructure(),
  });
};

export const useInfrastructureDeleted = () => {
  return useMutation({
    mutationFn: (id: string) => serviceinfrastructure.deleteInfrastructure(id),
    onSuccess: (response) => {
      toast.success("Infrastructure supprimée avec succès");
    },
  });
};
