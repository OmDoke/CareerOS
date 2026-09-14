import { api } from "../../../lib/api";

export const authService = {
  async register(data: unknown) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  async login(data: unknown) {
    const res = await api.post("/auth/login", data);
    return res.data.data;
  },
  async logout() {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};
