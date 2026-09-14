import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

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
    },
  });
}
