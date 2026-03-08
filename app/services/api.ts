import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_URL || "",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const hasApiConfig = !!API_URL;

export default api;
