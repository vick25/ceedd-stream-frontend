import { serviceinfrastructure } from "@/services/infrastructure";
import {
  InfrastructureFilters,
  InfrastructureSearch,
} from "@/types/infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";

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
      // console.log(response);
      toast.success("Mise à jour de l'infrastructure réussie.");
    },
    onError: (error) => {
      toast.error("Impossible de modifier l'infrastructure.");
    },
  });
};

export const useInfrastructures = () => {
  return useQuery({
    queryKey: ["infrastructures"],
    queryFn: () => serviceinfrastructure.getInfrastructure(),
  });
};

export const useGetInfrastructureById = (id: string) => {
  return useQuery({
    queryKey: ["infrastructureById", id],
    queryFn: () => serviceinfrastructure.getInfrastructureById(id),
    enabled: !!id,
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

type InfrastructureResponse = InfrastructureSearch;

export const useInfrastructureByAdresse = (
  searchTerm: string,
  delay: number = 400,
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

type InfrastructureResponseLocation = InfrastructureSearch;
export const useInfrastructureByAdresseLocation = (
  locationFilters: InfrastructureFilters,
  runSearch: boolean,
) => {
  const queryKey = ["infrastructureLocation", locationFilters];

  const isFilterSelected = Object.values(locationFilters).some(
    (value) => value !== "",
  );
  const isEnabled = runSearch && isFilterSelected;

  const query = useQuery<InfrastructureResponseLocation, Error>({
    queryKey: queryKey,
    queryFn: () =>
      serviceinfrastructure.getInfrastructureByadresseLocation(locationFilters),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });
  useEffect(() => {
    if (query.isError) {
      toast.error("l'élément cherché n'existe pas!");
    }
  }, [query.isError]);

  return query;
};

type InfrastructureResponseDate = InfrastructureSearch;

export const useInfrastructureVolumeByDate = (
  dateFilters: InfrastructureFilters,
  runSearch: boolean,
) => {
  const queryKey = ["infrastructureLocation", dateFilters];

  const isFilterSelected = Object.values(dateFilters).some(
    (value) => value !== "",
  );
  const isEnabled = runSearch && isFilterSelected;

  const query = useQuery<InfrastructureResponseLocation, Error>({
    queryKey: queryKey,
    queryFn: () =>
      serviceinfrastructure.getInfrastructureVolumeByDate(dateFilters),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });
  useEffect(() => {
    if (query.isError) {
      toast.error("l'élément cherché n'existe pas!");
    }
  }, [query.isError]);

  return query;
};
