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
      {errorMsg && (
        <div className="text-rose-300 text-xs p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 font-medium">
          {errorMsg}
        </div>
      )}
      
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="text-rose-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
          Password
        </Label>
        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="text-rose-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-3.5 shadow-lg shadow-primary/30 border border-white/15 transition-all hover:scale-[1.01] active:scale-95" 
          disabled={isSubmitting || loginMutation.isPending}
        >
          {isSubmitting || loginMutation.isPending ? "Logging in..." : "Login to CareerOS"}
        </Button>
      </div>
    </form>
  );
};
