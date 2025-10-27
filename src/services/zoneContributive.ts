import { zone_contributive } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

export const serviceZoneContributive = {
  async getZoneContributiveId(id: string): Promise<any> {
    const response = await API.get<zone_contributive>(
      `${API_ENDPOINTS.api}${ceedd.zonecontributive}${id}/`
    );
    return response.data;
  },
  async createZoneContributive(data: any) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.zonecontributive}/`,
      data
    );
    return response.data;
  },
  async getZoneContributiveAll(): Promise<any> {
    const response = await API.get<zone_contributive[]>(
      `${API_ENDPOINTS.api}${ceedd.zonecontributive}/`
    );
    return response.data;
  },
  async updateZoneContributive(data: any, id: string): Promise<any> {
    const response = await API.put(
      `${API_ENDPOINTS.api}${ceedd.zonecontributive}${id}/`,
      data
    );
    return response.data;
  },
  async deleteZoneContributive(id: string): Promise<any> {
    const response = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.zonecontributive}${id}/`
    );
    return response.data;
  },
};
