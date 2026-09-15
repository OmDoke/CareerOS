import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useEvaluateAnswer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/questions/evaluate", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["question-history"] });
    }
  });
}

export function useQuestionHistory() {
  return useQuery({
    queryKey: ["question-history"],
    queryFn: async () => {
      const response = await api.get("/questions/history");
      return response.data.data;
    },
  });
}

export function useQuestionAttempt(id: string) {
  return useQuery({
    queryKey: ["question-attempt", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/questions/history/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useQuestionStatistics() {
  return useQuery({
    queryKey: ["question-statistics"],
    queryFn: async () => {
      const response = await api.get("/questions/statistics");
      return response.data.data;
    },
  });
}

export function useTopicStatistics(topicId: string) {
  return useQuery({
    queryKey: ["topic-statistics", topicId],
    queryFn: async () => {
      if (!topicId) return null;
      const response = await api.get(`/questions/topic/${topicId}`);
      return response.data.data;
    },
    enabled: !!topicId,
  });
}
