import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.CONFIG_API_URL || "http://localhost:3001/api/v1",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.response?.data?.error;
    if (
      msg === "AI_PROVIDER_NOT_CONFIGURED" ||
      msg === "AI_PROVIDER_INITIALIZATION_FAILED" ||
      msg === "Invalid API Key" ||
      msg?.toLowerCase().includes("invalid api key") ||
      msg?.toLowerCase().includes("key is invalid")
    ) {
      window.dispatchEvent(new CustomEvent("ai-provider-missing"));
    } else if (msg) {
      toast.error(msg, { id: msg });
    } else if (error.message) {
      toast.error(error.message, { id: error.message });
    }
    return Promise.reject(error);
  }
);
