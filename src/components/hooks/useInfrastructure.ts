import { serviceinfrastructure } from "@/services/infrastructure";
import { useMutation } from "@tanstack/react-query";

export const useGetInfrastructure = () => {
  return useMutation({
    mutationFn: serviceinfrastructure.getInfrastructure,
    onSuccess: (response: any) => {},
  });
};
export const useUpdateInfrastructure = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: any }) =>
      serviceinfrastructure.updateInfrastructure(data, id),
    onSuccess: (response) => {
      console.log(response);
    },
  });
};
