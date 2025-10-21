import { serviceinfrastructure } from "@/services/infrastructure";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
      toast.success("Mise à jour de l'infrastructure reussi");
    },
    onError: (error) => {
      toast.error("Impossible de modifier l'infrastructures");
    },
  });
};
