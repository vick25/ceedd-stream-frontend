import { serviceZoneContributive } from "@/services/zoneContributive";
import { useMutation } from "@tanstack/react-query";

export const useZoneContributive = () => {
  return useMutation({
    mutationFn: (id: string) =>
      serviceZoneContributive.getZoneContributiveId(id),
    onSuccess: (response) => {},
  });
};
