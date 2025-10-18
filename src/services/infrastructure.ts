import { InfrastructureType } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

interface InfrastructureData {
  nom: string;
  type_infrastructure_id: string;
  date_construction: string;
  latitude: number;
  longitude: number;
  capacite: number;
  unite: string;
  zone_id: string;
  client_id: string;
}
export const serviceinfrastructure = {
  async getInfrastructure(): Promise<any> {
    const response = await API.get<InfrastructureType[]>(
      `${API_ENDPOINTS.api}${ceedd.infrastructure}`
    );

    return response.data;
  },
  async createInfrastructure(data: InfrastructureData) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.infrastructure}`,
      data
    );
  },
};
