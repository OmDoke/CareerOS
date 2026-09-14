import { api } from "../../../lib/api";

export const resumeService = {
  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append("resume", file);

    // Do NOT set Content-Type manually — the browser must auto-generate it
    // with the multipart boundary, otherwise multer cannot parse the body.
    const res = await api.post("/resume/upload", formData);
    return res.data.data.resume;
  },
  async getResume() {
    const res = await api.get("/resume");
    return res.data.data.resume;
  },
  async updateResume(data: unknown) {
    const res = await api.patch("/resume", data);
    return res.data.data.resume;
  },
  async deleteResume() {
    const res = await api.delete("/resume");
    return res.data;
  },
  downloadResumeUrl() {
    return `${api.defaults.baseURL}/resume/download`;
  }
};
