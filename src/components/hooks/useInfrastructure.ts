import { serviceinfrastructure } from "@/services/infrastructure";
import { useMutation } from "@tanstack/react-query";

export const useGetInfrastructure = () => {
  return useMutation({
    mutationFn: serviceinfrastructure.getInfrastructure,
    onSuccess: (response: any) => {
      console.log(response.results);
    },
  });
};
