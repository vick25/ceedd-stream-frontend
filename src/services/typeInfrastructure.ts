import { type_infrastructure } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

export const serviceTypeInfrastructure = {
  async getTypeInfrastructureId(id: string): Promise<any> {
    const response = await API.get<type_infrastructure>(
      `${API_ENDPOINTS.api}${ceedd.typeinfrastructure}/${id}`
    );
    return response.data;
  },
};
