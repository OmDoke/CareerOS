import { RegisterForm } from "../../../features/auth/components/RegisterForm";
import Link from "next/link";
import { PublicLayout } from "../../../layouts/PublicLayout";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4 selection:bg-primary/20 selection:text-primary">
        {/* Ambient Aurora Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-200/40 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-100/50 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-2xl p-8 md:p-10 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] relative z-10">
          <div className="text-center mb-6">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-500 shadow-lg shadow-primary/30 flex items-center justify-center text-white font-black text-lg mx-auto mb-3">
              C
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Create an Account</h1>
            <p className="text-xs text-slate-500 mt-1">Start your AI-powered interview preparation</p>
          </div>
          
          <RegisterForm />

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-700 hover:underline font-bold transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
