import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "../services/resume.service";
import { toast } from "sonner";

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
      toast.success("Resume uploaded successfully!", {
        description: "Your resume is now being analyzed by AI.",
      });
    },
    onError: () => {
      toast.error("Failed to upload resume.");
    }
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["resume"] });
      const previousResume = queryClient.getQueryData(["resume"]);
      queryClient.setQueryData(["resume"], null);
      toast.success("Resume deleted successfully");
      return { previousResume };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["resume"], context?.previousResume);
      toast.error("Failed to delete resume");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
};
