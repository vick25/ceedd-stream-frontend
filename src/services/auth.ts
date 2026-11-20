import { User } from "@/types/infrastructure";
import { auth, ceedd } from "@/utils/apiRoutes";
import { API_ENDPOINTS } from "@/utils/constants";
import API from "./api";
import { clearSession } from "@/lib/session";

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
    // Efface le user persisté ET le jeton (voir lib/session.ts)
    clearSession();
    return Promise.resolve();
  },
};
