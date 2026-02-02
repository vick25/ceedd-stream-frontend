import { serviceTypeInfrastructure } from "@/services/typeInfrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useTypeInfrastructure = () => {
  return useMutation({
    mutationFn: (id: string) =>
      serviceTypeInfrastructure.getTypeInfrastructureId(id),
    onSuccess: (response) => {
      // console.log("typeInfra", response);
    },
  });
};

export const useAllTypeInfrastructure = () => {
  return useMutation({
    mutationFn: serviceTypeInfrastructure.getTypeInfrastructureAll,
    onSuccess: (response) => {
      // console.log(response);
    },
  });
};

export const useTypeInfrastructures = () => {
  return useQuery({
    queryKey: ["type_infrastructures"],
    queryFn: () => serviceTypeInfrastructure.getTypeInfrastructureAll(),
  });
};
export const useUpdateTypeInfrastructure = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: any }) =>
      serviceTypeInfrastructure.updateTypeInfrastructure(data, id),
    onSuccess: (response) => {
      toast.success("Mise à jour du type infrastructure reussi");
    },
  });
};
