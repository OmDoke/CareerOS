import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useRoadmap() {
  return useQuery({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const response = await api.get("/roadmap");
      return response.data.data.roadmap;
    },
    retry: false,
  });
}

export function useGenerateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetRole, force = false }: { targetRole: string; force?: boolean }) => {
      const response = await api.post("/roadmap/generate", { targetRole, force });
      return response.data.data.roadmap;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/roadmap");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
  });
}
