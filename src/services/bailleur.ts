import { ceedd } from "@/utils/apiRoutes";
import { API_ENDPOINTS } from "@/utils/constants";
import API from "./api";

export const serviceBailleur = {
  async getBailleurs(): Promise<any> {
    const response = await API.get(`${API_ENDPOINTS.api}${ceedd.bailleur}`);
    return response.data;
  },
  async createBailleur(data: any) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.bailleur}`,
      data,
    );
    return response.data;
  },
  async updateBailleur(id: string, data: any) {
    const response = API.put(
      `${API_ENDPOINTS.api}${ceedd.bailleur}${id}/`,
      data,
    );
  },
  async deleteBailleur(id: string) {
    const reponse = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.bailleur}${id}/`,
    );
    return reponse.data;
  },
};
