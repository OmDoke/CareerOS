"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useLogin } from "../hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const loginMutation = useLogin();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMsg("");
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setErrorMsg(err.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && <div className="text-red-500 text-sm p-2 bg-red-100 rounded">{errorMsg}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || loginMutation.isPending}>
        {isSubmitting || loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
