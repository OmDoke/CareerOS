"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useUser, useUpdateProfile } from "../hooks/useUser";
import { useState, useEffect } from "react";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional().or(z.literal("")),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { data: user, isLoading } = useUser();
  const updateMutation = useUpdateProfile();
  const [msg, setMsg] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    setMsg({ type: "", text: "" });
    updateMutation.mutate(data, {
      onSuccess: () => {
        setMsg({ type: "success", text: "Profile updated successfully!" });
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
      },
    });
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      {msg.text && (
        <div className={`p-2 rounded text-sm ${msg.type === "error" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-2">
        <Label>Email</Label>
        <Input disabled value={user?.email || ""} />
        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" {...register("firstName")} />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" {...register("lastName")} />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
        {isSubmitting || updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
