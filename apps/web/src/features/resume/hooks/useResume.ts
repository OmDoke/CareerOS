import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "../services/resume.service";

export const useResume = () => {
  return useQuery({
    queryKey: ["resume"],
    queryFn: resumeService.getResume,
    retry: false,
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => resumeService.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => resumeService.updateResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resumeService.deleteResume,
    onSuccess: () => {
      queryClient.setQueryData(["resume"], null);
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
};
