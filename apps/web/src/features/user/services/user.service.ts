import { api } from "../../../lib/api";

export const userService = {
  async getMe() {
    const res = await api.get("/users/me");
    return res.data.data.user;
  },
  async updateProfile(data: unknown) {
    const res = await api.patch("/users/profile", data);
    return res.data.data.user;
  },
  async changePassword(data: unknown) {
    const res = await api.patch("/users/change-password", data);
    return res.data;
  },
};
