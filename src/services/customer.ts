import { client } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

export const serviceCustomer = {
  async getCustomerId(id: string): Promise<any> {
    const response = await API.get<client>(
      `${API_ENDPOINTS.api}${ceedd.client}/${id}`
    );

    return response.data;
  },
  async getCustomerAll(): Promise<any> {
    const response = await API.get<client[]>(
      `${API_ENDPOINTS.api}${ceedd.client}`
    );
    return response.data;
  },
};
