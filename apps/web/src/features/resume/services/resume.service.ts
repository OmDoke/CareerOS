import { api } from "../../../lib/api";

export const resumeService = {
  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append("resume", file);
    
    const res = await api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
