import { API_ENDPOINTS } from "@/utils/constants";
import API from "./api";
import { ceedd } from "@/utils/apiRoutes";
interface PhotoData {
  url: string;
}
export const servicePhotos = {
  async createPhoto(data: PhotoData) {
    const response = await API.post(`${API_ENDPOINTS.api}${ceedd.photo}`, data);
    console.log(response.data);
    debugger;
    return response.data;
  },
};
