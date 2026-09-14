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
  Sparkles
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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
            <span className="font-bold text-xl tracking-tight">CareerOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Interview Prep</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground leading-tight">
              Master your next tech interview with <span className="text-primary">CareerOS</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume, set your target role, and let our AI generate a personalized curriculum with dynamic practice questions tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  Start Learning for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A complete suite of tools designed to identify your weak points and turn them into strengths.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-start">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Resume AI Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We parse your resume to understand exactly what you already know, so you never waste time learning basics you've already mastered.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-start">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Custom Roadmap</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tell us your dream job title. We'll generate a step-by-step curriculum bridging the gap between your resume and the job description.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-start">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Answer unique, context-aware interview questions generated on-the-fly. Get hints and conceptual explanations when you're stuck.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">How it works</h2>
            <div className="space-y-8">
              {[
                "Create your account & upload your current resume.",
                "Set your target role (e.g., 'Senior Frontend Engineer').",
                "Follow your daily AI-generated study sessions (~60 mins/day).",
                "Practice dynamic interview questions until you master every topic."
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 bg-card border rounded-xl p-4 shadow-sm text-left">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                  <CheckCircle2 className="ml-auto h-5 w-5 text-green-500 opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-card">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              C
            </div>
            <span className="font-semibold tracking-tight">CareerOS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
