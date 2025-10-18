import { zone_contributive } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

export const serviceZoneContributive = {
  async getZoneContributiveId(id: string): Promise<any> {
    const response = await API.get<zone_contributive>(
      `${API_ENDPOINTS.api}${ceedd.zonecontributive}/${id}`
    );
    return response.data;
  },
};
