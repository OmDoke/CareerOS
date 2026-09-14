import { RegisterForm } from "../../../features/auth/components/RegisterForm";
import Link from "next/link";
import { PublicLayout } from "../../../layouts/PublicLayout";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-lg border shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
          <RegisterForm />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
