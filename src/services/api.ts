import axios from "axios";
import { error } from "console";
import { config } from "node_modules/zod/v4/core/core";
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("ceeAuth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("ceeAuth-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
