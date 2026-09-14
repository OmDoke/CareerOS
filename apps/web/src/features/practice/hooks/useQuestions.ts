import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useGenerateQuestion() {
  return useMutation({
    mutationFn: async ({ sessionId, taskId }: { sessionId: string; taskId: string }) => {
      const response = await api.post("/questions/next", { sessionId, taskId });
      return response.data.data;
    },
  });
}

export function useSkipQuestion() {
  return useMutation({
    mutationFn: async ({ attemptId }: { attemptId: string }) => {
      const response = await api.post("/questions/skip", { attemptId });
      return response.data.data;
    },
  });
}

export function useQuestionHint() {
  return useMutation({
    mutationFn: async ({ attemptId, userAnswer }: { attemptId: string; userAnswer?: string | null }) => {
      const response = await api.post("/questions/hint", { attemptId, userAnswer });
      return response.data.data;
    },
  });
}

export function useQuestionExplanation() {
  return useMutation({
    mutationFn: async ({ attemptId }: { attemptId: string }) => {
      const response = await api.post("/questions/explain", { attemptId });
      return response.data.data;
    },
  });
}
