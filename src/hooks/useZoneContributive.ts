import { serviceZoneContributive } from "@/services/zoneContributive";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useZoneContributive = () => {
  return useMutation({
    mutationFn: (id: string) =>
      serviceZoneContributive.getZoneContributiveId(id),
    onSuccess: (response) => {},
  });
};
export const useCreateZoneContributives = () => {
  return useMutation({
    mutationFn: (data: any) =>
      serviceZoneContributive.createZoneContributive(data),
    onSuccess: (response) => {
      toast.success("Zone contributive créée avec succès");
    },
  });
};
export const useUpdateZoneContributive = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: any }) =>
      serviceZoneContributive.updateZoneContributive(data, id),
    onSuccess: (response) => {
      toast.success("Mise à jour de la zone contributive reussi");
    },
    onError: (error) => {
      toast.error("Impossible de modifier la zone contributive");
    },
  });
};
export const useZoneContributives = () => {
  return useQuery({
    queryKey: ["zone_contributives"],
    queryFn: () => serviceZoneContributive.getZoneContributiveAll(),
  });
};

export const useZoneContributiveDeleted = () => {
  return useMutation({
    mutationFn: (id: string) =>
      serviceZoneContributive.deleteZoneContributive(id),
    onSuccess: (response) => {
      toast.success("Zone contributive supprimée avec succès");
    },
    onError: (error) => {
      toast.error("Impossible de supprimer la zone contributive");
    },
  });
};
