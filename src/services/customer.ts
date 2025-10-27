import { client } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

export const serviceCustomer = {
  async getCustomerId(id: string): Promise<any> {
    const response = await API.get<client>(
      `${API_ENDPOINTS.api}${ceedd.client}${id}`
    );

    return response.data;
  },
  async getCustomerAll(): Promise<any> {
    const response = await API.get<client[]>(
      `${API_ENDPOINTS.api}${ceedd.client}`
    );
    return response.data;
  },
  async createCustomer(data: any) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.client}`,
      data
    );
    return response.data;
  },
  async updateCustomer(data: any, id: string): Promise<any> {
    const response = await API.put(
      `${API_ENDPOINTS.api}${ceedd.client}${id}/`,
      data
    );
    return response.data;
  },
  async deleteCustomer(id: string): Promise<any> {
    const response = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.client}${id}/`
    );
    return response.data;
  },
};
