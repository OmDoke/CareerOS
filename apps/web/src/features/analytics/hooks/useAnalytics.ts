import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: async () => {
      const response = await api.get("/analytics/dashboard");
      return response.data;
    },
  });
}

export function useProgressAnalytics() {
  return useQuery({
    queryKey: ["progress-analytics"],
    queryFn: async () => {
      const response = await api.get("/analytics/progress");
      return response.data;
    },
  });
}
