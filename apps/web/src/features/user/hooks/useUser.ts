import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { useAuthStore } from "../../../store/auth.store";

export const useUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const user = await userService.getMe();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["user", "me"], user);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userService.changePassword,
  });
};
