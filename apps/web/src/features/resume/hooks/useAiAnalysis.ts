import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { toast } from "sonner";

export function useAiAnalysis() {
  return useQuery({
    queryKey: ["resume", "analysis"],
    queryFn: async () => {
      const response = await api.get("/resume/analysis");
      return response.data.data.resume;
    },
    retry: false,
  });
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ force = false }: { force?: boolean } = {}) => {
      const response = await api.post("/resume/analyze", { force });
      return response.data.data.resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      toast.success("Resume analyzed successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (error.response?.status === 403 && message === "AI_PROVIDER_NOT_CONFIGURED") {
        toast.error("Please set your Gemini API key in Settings to use AI features.");
      } else {
        toast.error(message || "Failed to analyze resume. Please try again.");
      }
    },
  });
}
