"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useChangePassword } from "../hooks/useUser";
import { useState } from "react";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordForm = () => {
  const changePasswordMutation = useChangePassword();
  const [msg, setMsg] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    setMsg({ type: "", text: "" });
    changePasswordMutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setMsg({ type: "success", text: "Password changed successfully!" });
          reset();
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          setMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      {msg.text && (
        <div className={`p-2 rounded text-sm ${msg.type === "error" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input id="currentPassword" type="password" {...register("currentPassword")} />
        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" type="password" {...register("newPassword")} />
        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting || changePasswordMutation.isPending}>
        {isSubmitting || changePasswordMutation.isPending ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
};
