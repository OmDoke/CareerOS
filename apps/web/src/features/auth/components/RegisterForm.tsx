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
      {errorMsg && <div className="text-red-500 text-sm p-2 bg-red-100 rounded">{errorMsg}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...formRegister("firstName")} />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...formRegister("lastName")} />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...formRegister("email")} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...formRegister("password")} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || registerMutation.isPending}>
        {isSubmitting || registerMutation.isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};
