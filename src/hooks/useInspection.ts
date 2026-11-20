import { serviceInspection } from "@/services/inspection";
import { fetchAllPages } from "@/services/pagination";
import { ceedd } from "@/utils/apiRoutes";
import { API_ENDPOINTS } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { any, string } from "zod";

export const useGetInspections = () => {
  return useQuery({
    queryFn: serviceInspection.getInspections,
    queryKey: ["inspections"],
  });
};

// Toutes les inspections (toutes les pages). Même clé que la fiche
// infrastructure : le cache est partagé entre les deux écrans.
export const useAllInspections = () => {
  return useQuery({
    queryKey: ["inspections", "all"],
    queryFn: () => fetchAllPages(`${API_ENDPOINTS.api}${ceedd.inspection}`),
  });
};

export const useCreateInspection = () => {
  return useMutation({
    mutationFn: (data: any) => serviceInspection.createInspection(data),
    onSuccess: (response) => {
      toast.success("La créee de l'inspection se fait avec succées");
    },
    onError: (error) => {
      toast.error("Impossible de créer un inspection");
    },
  });
};

export const useUpdateInspection = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      serviceInspection.updateInspection(data, id),
    onSuccess: (response) => {
      toast.success("La mise à jour effectuer avec succée");
    },
    onError: (error) => {
      toast.error("Impossible de Modifier une inspection");
    },
  });
};
