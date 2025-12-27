import { InfrastructureTypes } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

export const serviceTypeInfrastructure = {
  async getTypeInfrastructureId(id: string): Promise<any> {
    const response = await API.get<InfrastructureTypes>(
      `${API_ENDPOINTS.api}${ceedd.typeinfrastructure}${id}/`
    );
    return response.data;
  },
  async getTypeInfrastructureAll(): Promise<any> {
    const response = await API.get<InfrastructureTypes[]>(
      `${API_ENDPOINTS.api}${ceedd.typeinfrastructure}`
    );
    return response.data;
  },
  async createTypeInfrastructure(data: any) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.typeinfrastructure}/`,
      data
    );
    return response.data;
  },
  async updateTypeInfrastructure(data: any, id: string): Promise<any> {
    const response = await API.put(
      `${API_ENDPOINTS.api}${ceedd.typeinfrastructure}${id}/`,
      data
    );
    return response.data;
  },
  async deleteTypeInfrastructure(id: string): Promise<any> {
    const response = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.typeinfrastructure}${id}/`
    );
    return response.data;
  },
};
