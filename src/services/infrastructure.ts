import { InfrastructureTypes } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

interface InfrastructureData {
  nom: string;
  type_infrastructure: string;
  date_construction: string;
  latitude: number;
  longitude: number;
  capacite: number;
  unite: string;
  zone: string;
  client: string;
}
export const serviceinfrastructure = {
  async getInfrastructure(): Promise<any> {
    const response = await API.get<InfrastructureTypes[]>(
      `${API_ENDPOINTS.api}${ceedd.infrastructure}`
    );

    return response.data;
  },
  async createInfrastructure(data: InfrastructureData) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.infrastructure}`,
      data
    );
    return response.data;
  },
  async updateInfrastructure(data: any, id: string): Promise<any> {
    const response = await API.put(
      `${API_ENDPOINTS.api}${ceedd.infrastructure}${id}/`,
      data
    );

    return response.data;
  },
  async deleteInfrastructure(id: string): Promise<any> {
    const response = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.infrastructure}${id}/`
    );
    return response.data;
  },
};
