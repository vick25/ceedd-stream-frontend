import { API_ENDPOINTS } from "@/utils/constants";
import API from "./api";
import { ceedd } from "@/utils/apiRoutes";
import { Inspection } from "@/types/infrastructure";
import { dataListItemPropDefs } from "@radix-ui/themes/components/data-list.props";

export const serviceInspection = {
  async getInspections() {
    const response = await API.get(`${API_ENDPOINTS.api}${ceedd.inspection}`);
    return response.data;
  },
  async getInspection(id: string): Promise<any> {
    const response = await API.get<Inspection>(
      `${API_ENDPOINTS.api}${ceedd.inspection}${id}/`
    );
    return response.data;
  },
  async createInspection(data: any) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.inspection}`,
      data
    );

    return response.data;
  },
  async updateInspection(data: any, id: string): Promise<any> {
    const response = await API.put(
      `${API_ENDPOINTS.api}${ceedd.inspection}${id}/`,
      data
    );
    return response.data;
  },
  async deleteInspection(id: string): Promise<any> {
    const response = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.inspection}${id}/`
    );
    return response.data;
  },
};
