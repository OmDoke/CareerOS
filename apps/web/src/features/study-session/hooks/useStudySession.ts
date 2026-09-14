import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useTodaySession() {
  return useQuery({
    queryKey: ["study-session", "today"],
    queryFn: async () => {
      const response = await api.get("/study-session/today");
      return response.data.data.session;
    },
    retry: false,
  });
}

export function useGenerateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/study-session/generate");
      return response.data.data.session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-session"] });
    },
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/study-session/${id}/complete`);
      return response.data.data.session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-session"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
  });
}

export function useSessionHistory() {
  return useQuery({
    queryKey: ["study-session", "history"],
    queryFn: async () => {
      const response = await api.get("/study-session/history");
      return response.data.data.history;
    },
  });
}
