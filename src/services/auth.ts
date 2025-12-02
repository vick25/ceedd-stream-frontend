import { User } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { auth, ceedd } from "@/utils/apiRoutes";
interface LoginCredentials {
  username: string;
  password: string;
}
interface RegisterData {
  username: string;
  password: string;
}
export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await API.post<User>(
      `${API_ENDPOINTS.apiAuth}${auth.login}`,
      credentials
    );

    return response.data;
  },
  async register(data: RegisterData) {
    const response = await API.post(
      `${API_ENDPOINTS.apiAuth}${ceedd.users}${auth.register}`,
      data
    );
  },
  async logout() {
    localStorage.removeItem("ceedd");
    return Promise.resolve();
  },
};
