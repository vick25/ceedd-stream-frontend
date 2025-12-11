import { serviceinfrastructure } from "@/services/infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { error } from "console";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { InfrastructureTypes } from "@/types/infrastructure";
import { useEffect } from "react";

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
type InfrastructureResponse = InfrastructureTypes[];
export const useInfrastructureByAdresse = (
  searchTerm: string,
  delay: number = 400
) => {
  const debounceTerm = useDebounce(searchTerm, delay);

  const isSearchearDebounce = debounceTerm.length >= 3;
  const query = useQuery<InfrastructureResponse, Error>({
    queryKey: ["infrastructureSearch", debounceTerm],
    queryFn: () =>
      serviceinfrastructure.getInfrastrucureByAdresse(debounceTerm),
    enabled: isSearchearDebounce,
    staleTime: 1000 * 60 * 5,
  });
  useEffect(() => {
    if (query.isError) {
      toast.error("Impossible d'effectuer la recherche. Veuillez réessayer.");
    }
  }, [query.isError]);

  return query;
};
