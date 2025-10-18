import { serviceTypeInfrastructure } from "@/services/typeInfrastructure";
import { useMutation } from "@tanstack/react-query";

export const useTypeInfrastructure = () => {
  return useMutation({
    mutationFn: (id: string) =>
      serviceTypeInfrastructure.getTypeInfrastructureId(id),
    onSuccess: (response) => {
      console.log("typeInfra", response);
    },
  });
};

export const useAllTypeInfrastructure = () => {
  return useMutation({
    mutationFn: serviceTypeInfrastructure.getTypeInfrastructureAll,
    onSuccess: (response) => {
      console.log(response);
    },
  });
};
