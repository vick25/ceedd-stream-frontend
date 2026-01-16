import { ceedd } from "@/utils/apiRoutes";
import { API_ENDPOINTS } from "@/utils/constants";
import API from "./api";

interface PhotoData {
  url: string;
}
export const servicePhotos = {
  async createPhoto(data: PhotoData) {
    const response = await API.post(`${API_ENDPOINTS.api}${ceedd.photo}`, data);
    // console.log(response.data);
    debugger;
    return response.data;
  },
  async getPhotoById(id: string): Promise<any> {
    const response = await API.get(`${API_ENDPOINTS.api}${ceedd.photo}/${id}`);
    return response.data;
  },
  async getPhotos(): Promise<any[]> {
    const response = await API.get(`${API_ENDPOINTS.api}${ceedd.photo}`);
    return response.data;
  },
};
