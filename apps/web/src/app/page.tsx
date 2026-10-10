"use client";

import Link from "next/link";
import { useAuthStore } from "../store/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Code2, 
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Prevent flash before redirect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Dynamic Ambient Glassmorphism Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[25%] w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-[150px] animate-pulse" style={{ animationDuration: "9s" }} />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-[140px] animate-pulse" style={{ animationDuration: "11s" }} />
        <div className="absolute bottom-[-15%] left-[20%] w-[650px] h-[650px] rounded-full bg-purple-100/30 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-500 shadow-lg shadow-primary/30 flex items-center justify-center text-white font-black text-lg">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent">CareerOS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <button className="rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[10px] px-6 py-2.5 shadow-md shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-36 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 backdrop-blur-xl text-teal-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              <span>Next-Gen AI Career Preparation</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 text-slate-950 leading-[1.1]">
              Master your next tech interview with <span className="bg-gradient-to-r from-purple-600 via-primary to-teal-600 bg-clip-text text-transparent">CareerOS</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your resume, set your dream target role, and let our adaptive AI generate a personalized study curriculum with dynamic practice problems tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="h-13 px-9 rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-xs shadow-xl shadow-primary/30 border border-primary/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-2.5">
                  Start Learning for Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="h-13 px-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold uppercase tracking-wider text-xs shadow-sm backdrop-blur-md transition-all active:scale-95">
                  Sign In to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-2">Key Capabilities</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 mb-4">
                Everything you need to break into top tech
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
                A complete suite of intelligent tools designed to identify your weak spots and systematically turn them into strengths.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col items-start hover:border-primary/30 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary shadow-sm">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resume AI Analysis</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  We parse your resume to understand exactly what you already know, so you never waste time studying fundamentals you&apos;ve already mastered.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col items-start hover:border-primary/30 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-6 text-teal-700 shadow-sm">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Adaptive Curriculum</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Tell us your target role. We generate a step-by-step curriculum bridging the gap between your background and the specific job criteria.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col items-start hover:border-primary/30 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-6 text-purple-700 shadow-sm">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Dynamic Evaluation</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Answer unique, context-aware interview questions generated on-the-fly. Get instant hints and conceptual explanations when you&apos;re stuck.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-2">Step-by-Step</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 mb-12">
              How CareerOS works
            </h2>
            <div className="space-y-4 text-left">
              {[
                { title: "Upload Resume", desc: "Upload your resume in PDF/Word format for instant AI parsing." },
                { title: "Set Target Role", desc: "Choose your desired role (e.g., Full Stack Engineer, Staff Backend)." },
                { title: "Daily 60-min Focus", desc: "Follow algorithmically calibrated bite-sized daily study sessions." },
                { title: "Interview Readiness", desc: "Benchmark your skills with real-time feedback and radar analytics." }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-5 shadow-soft hover:bg-white transition-all">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-sm shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-10 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">
              C
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">CareerOS</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CareerOS. Powered by TalentsPro / AI Gorilla OS design architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}
