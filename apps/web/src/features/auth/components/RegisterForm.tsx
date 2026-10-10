"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useRegister } from "../hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const registerMutation = useRegister();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setErrorMsg("");
    registerMutation.mutate(data, {
      onSuccess: () => {
        router.push("/login?registered=true");
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setErrorMsg(err.response?.data?.message || "Registration failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="text-rose-700 text-xs p-3 rounded-2xl bg-rose-50 border border-rose-200 font-medium">
          {errorMsg}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">First Name</Label>
          <Input id="firstName" placeholder="Alex" {...formRegister("firstName")} />
          {errors.firstName && <p className="text-rose-600 text-xs mt-1 ml-1 font-medium">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Last Name</Label>
          <Input id="lastName" placeholder="Smith" {...formRegister("lastName")} />
          {errors.lastName && <p className="text-rose-600 text-xs mt-1 ml-1 font-medium">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...formRegister("email")} />
        {errors.email && <p className="text-rose-600 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</Label>
        <Input id="password" type="password" placeholder="At least 8 chars" {...formRegister("password")} />
        {errors.password && <p className="text-rose-600 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.01] active:scale-95" 
          disabled={isSubmitting || registerMutation.isPending}
        >
          {isSubmitting || registerMutation.isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
};
