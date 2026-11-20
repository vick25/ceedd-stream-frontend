import { Client } from "@/types/infrastructure";
import API from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { ceedd } from "@/utils/apiRoutes";

// Format de réponse paginée renvoyé par l'API (Django REST, LimitOffsetPagination)
export interface PaginatedResponse<T> {
  count: number; // nombre TOTAL de clients en base
  next: string | null; // URL de la page suivante (null = dernière page)
  previous: string | null;
  results: T[]; // uniquement les clients de la page demandée
}

// Nombre de clients par page (doit correspondre au pageItems de la table)
export const CUSTOMERS_PAGE_SIZE = 30;

export const serviceCustomer = {
  async getCustomerId(id: string): Promise<any> {
    const response = await API.get<Client>(
      // le "/" final est requis par Django REST : sans lui, le serveur répond
      // par une redirection, qui échoue en CORS avec le header Authorization
      `${API_ENDPOINTS.api}${ceedd.client}${id}/`,
    );

    return response.data;
  },

  // Une seule page de clients : offset = index du premier client voulu
  async getCustomerAll(
    offset: number = 0,
    limit: number = CUSTOMERS_PAGE_SIZE,
  ): Promise<PaginatedResponse<Client>> {
    const response = await API.get<PaginatedResponse<Client>>(
      `${API_ENDPOINTS.api}${ceedd.client}`,
      { params: { limit, offset } },
    );
    return response.data;
  },

  // TOUS les clients : on enchaîne les pages tant que l'API renvoie un "next".
  // Utile pour les listes déroulantes et la recherche, qui doivent voir tout le monde.
  async getAllCustomersPages(): Promise<PaginatedResponse<Client>> {
    const limit = 100;
    // Garde-fou : si l'API renvoyait toujours un "next" (bug, réponse
    // malveillante), la boucle ne tournerait pas à l'infini.
    const MAX_PAGES = 200; // 200 × 100 = 20 000 clients max
    let pages = 0;
    let offset = 0;
    let all: Client[] = [];
    let page: PaginatedResponse<Client>;

    do {
      page = await serviceCustomer.getCustomerAll(offset, limit);
      all = all.concat(page.results ?? []);
      offset += limit;
      pages += 1;
    } while (page.next && pages < MAX_PAGES);

    return { count: page.count, next: null, previous: null, results: all };
  },

  async createCustomer(data: any) {
    const response = await API.post(
      `${API_ENDPOINTS.api}${ceedd.client}`,
      data,
    );
    return response.data;
  },
  async updateCustomer(data: any, id: string): Promise<any> {
    const response = await API.put(
      `${API_ENDPOINTS.api}${ceedd.client}${id}/`,
      data,
    );
    return response.data;
  },
  async deleteCustomer(id: string): Promise<any> {
    const response = await API.delete(
      `${API_ENDPOINTS.api}${ceedd.client}${id}/`,
    );
    return response.data;
  },
};
