"use client";

import { useAuthStore } from "../../store/auth.store";
import { useTodaySession } from "../../features/study-session/hooks/useStudySession";
import { useDashboardAnalytics } from "../../features/analytics/hooks/useAnalytics";
import Link from "next/link";
import { 
  FileText, 
  Map, 
  CalendarDays, 
  ArrowRight, 
  CheckCircle2, 
  Dumbbell, 
  Trophy, 
  Flame, 
  Star, 
  BrainCircuit, 
  Target,
  Sparkles,
  Zap,
  Clock
} from "lucide-react";
import * as motion from "framer-motion/client";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { SkillRadar } from "../../features/analytics/components/SkillRadar";
import { useRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  
  const { data: roadmapData, isLoading: isLoadingRoadmap } = useRoadmap();
  const hasRoadmap = !!roadmapData;

  const { data: todaySession, isLoading: isLoadingSession } = useTodaySession(hasRoadmap);
  const { data: dashboardStats, isLoading: isLoadingStats } = useDashboardAnalytics();

  if (isLoadingSession || isLoadingStats || isLoadingRoadmap) {
    return (
      <>
        <SpinnerSkeleton />
      </>
    );
  }

  const steps = [
    { id: 1, name: "Upload Resume", status: user?.hasResume ? "complete" : "current", icon: FileText, href: "/resume" },
    { id: 2, name: "AI Analysis", status: user?.resumeStatus === "ANALYZED" ? "complete" : user?.hasResume ? "current" : "upcoming", icon: BrainCircuit, href: "/resume" },
    { id: 3, name: "Generate Roadmap", status: hasRoadmap ? "complete" : user?.resumeStatus === "ANALYZED" ? "current" : "upcoming", icon: Map, href: "/roadmap" },
    { id: 4, name: "Today's Study", status: todaySession?.status === "COMPLETED" ? "complete" : hasRoadmap ? "current" : "upcoming", icon: CalendarDays, href: "/today" },
    { id: 5, name: "Practice", status: "upcoming", icon: Dumbbell, href: "/practice" },
    { id: 6, name: "Interview Readiness", status: "upcoming", icon: Target, href: "#" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Top Header */}
      <PageHeader 
        title={`Welcome back, ${user?.firstName || user?.email?.split('@')[0] || "User"}!`}
        description="Here is your personalized interview preparation command center."
        action={
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full border border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Trophy className="h-3.5 w-3.5" />
              </div>
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Lvl 1</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-xs text-amber-600">
                {dashboardStats?.currentStreak || 0} Day Streak 🔥
              </span>
            </div>
          </div>
        }
      />

      {/* 6-step Guided User Flow (Glassmorphism Journey) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-2xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] relative overflow-hidden">
        {/* Subtle radial ambient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -mb-20" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 relative z-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Career Roadmap
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Your Mastery Journey</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Step-by-step AI curriculum to reach 100% interview readiness.
          </p>
        </div>

        <div className="relative mt-8">
          {/* Connector bar for desktop */}
          <div className="hidden md:block absolute top-6 left-8 right-8 h-[2px] bg-slate-200 -translate-y-1/2 z-0">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-primary to-accent transition-all duration-700 rounded-full"
              style={{
                width: `${
                  (steps.filter(s => s.status === 'complete').length / (steps.length - 1)) * 100
                }%`
              }}
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6 md:gap-0">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id} 
                className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2.5 w-full md:w-auto group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link 
                  href={step.status !== "upcoming" ? step.href : "#"} 
                  className="flex md:flex-col items-center gap-3 md:gap-2.5 w-full group"
                >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                    step.status === 'complete' && "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm",
                    step.status === 'current' && "bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-105",
                    step.status === 'upcoming' && "bg-slate-50 text-slate-400 border border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700 group-hover:bg-slate-100"
                  )}>
                    {step.status === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-left md:text-center">
                    <p className={cn(
                      "text-xs font-semibold tracking-tight transition-colors",
                      step.status === 'complete' && "text-emerald-700 font-bold",
                      step.status === 'current' && "text-slate-900 font-bold",
                      step.status === 'upcoming' && "text-slate-500 group-hover:text-slate-800"
                    )}>
                      {step.name}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                      {step.status === 'current' ? (
                        <span className="text-primary font-bold">In Progress</span>
                      ) : step.status === 'complete' ? (
                        <span className="text-emerald-600 font-semibold">Completed</span>
                      ) : (
                        "Pending"
                      )}
                    </p>
                  </div>
                </Link>
                {idx !== steps.length - 1 && (
                  <div className={cn(
                    "md:hidden absolute left-6 top-12 bottom-[-1.5rem] w-0.5",
                    step.status === 'complete' ? "bg-emerald-500" : "bg-slate-200"
                  )} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main 4-Stat Glassmorphism Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Coding Accuracy" 
          value={`${Math.round(dashboardStats?.codingAccuracy || 0)}%`} 
          icon={Flame} 
          trend={{ value: 0, label: "this week", positive: true }} 
          delay={0.05}
        />
        <StatCard 
          title="Theory Mastery" 
          value={`${Math.round(dashboardStats?.theoryAccuracy || 0)}%`} 
          icon={Target} 
          description="Across technical modules" 
          delay={0.1}
        />
        <StatCard 
          title="Practice Problems" 
          value={`${dashboardStats?.practiceQuestions || 0}`} 
          icon={Dumbbell} 
          description="Solved & evaluated" 
          delay={0.15}
        />
        <StatCard 
          title="Readiness Index" 
          value={`${Math.round(dashboardStats?.averageScore || 0)}%`} 
          icon={BrainCircuit} 
          description="Overall hiring benchmark" 
          delay={0.2}
        />
      </div>

      {/* Bottom Section: Today's Focus & Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Focus Card */}
          <div className="h-full rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-primary/10 transition-all duration-500" />
            
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Zap className="h-3 w-3" />
                    Daily Objective
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Today&apos;s Study Session</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Custom algorithmically tailored modules for your target role.</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>

              {todaySession ? (
                <div className="space-y-6 pt-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-slate-900">
                        {todaySession.status === "COMPLETED" ? "Session Completed! 🎉" : "Active Focus Session"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Complete today&apos;s exercises to maintain your streak.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-teal-700">
                        <Clock className="h-3 w-3" />
                        60 mins
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Progress</span>
                      <span className="text-accent font-bold">
                        {todaySession.status === "COMPLETED" ? "100%" : "33%"}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent transition-all duration-500 rounded-full" 
                        style={{ width: todaySession.status === "COMPLETED" ? "100%" : "33%" }} 
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/today" className="inline-block w-full sm:w-auto">
                      <button className="w-full sm:w-auto rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] px-8 py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                        {todaySession.status === "COMPLETED" ? "Review Completed Session" : "Continue Today's Session"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                    <CalendarDays className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No Active Session</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-6">
                    {hasRoadmap 
                      ? "Generate today's personalized study session to dive into curated practice questions."
                      : "Upload your resume and generate a curriculum roadmap to unlock daily sessions."}
                  </p>
                  <Link href={hasRoadmap ? "/today" : "/roadmap"}>
                    <button 
                      disabled={!user?.hasResume}
                      className="rounded-full bg-primary hover:bg-purple-600 disabled:opacity-50 text-white font-extrabold uppercase tracking-widest text-[11px] px-8 py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                    >
                      {hasRoadmap ? "Start Today's Session" : "Go to Roadmap"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom info banner */}
            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Adaptive AI Engine Active
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                TalentsPro Architecture
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Skill Radar */}
          <SkillRadar stats={dashboardStats} />

          {/* Activity Milestones Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timeline</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Recent Activity</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Account Created</p>
                    <p className="text-[10px] text-slate-500">Welcome to CareerOS!</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today</span>
              </div>
              
              {user?.hasResume ? (
                <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Resume Uploaded</p>
                      <p className="text-[10px] text-slate-500">AI analysis ready</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div>
                      <p className="text-xs font-medium text-slate-600">Upload your resume</p>
                      <p className="text-[10px] text-slate-400">To unlock custom roadmap</p>
                    </div>
                  </div>
                  <Link href="/resume" className="text-[10px] font-bold text-primary hover:underline">
                    Upload →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
