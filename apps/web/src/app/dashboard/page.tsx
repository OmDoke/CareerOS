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
  Clock,
  Compass,
  Check,
  ChevronRight,
  TrendingUp,
  Layers,
  Code2,
  BookOpen
} from "lucide-react";
import * as motion from "framer-motion/client";
import { CircularProgress } from "@/components/ui/circular-progress";
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

  // Greeting calculation
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const displayName = user?.firstName || user?.email?.split('@')[0] || "Candidate";

  // Roadmap metrics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalTopics = roadmapData?.modules?.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0) || 24;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedTopics = roadmapData?.modules?.reduce((acc: number, m: any) => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc + (m.topics?.filter((t: any) => t.status === "COMPLETED").length || 0)
  , 0) || 0;
  const curriculumPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // 7-day streak tracker (Monday = 0, Sunday = 6)
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const streakCount = dashboardStats?.currentStreak || 1;

  // 6-step guided roadmap journey
  const steps = [
    { id: 1, name: "Upload Resume", status: user?.hasResume ? "complete" : "current", icon: FileText, href: "/resume" },
    { id: 2, name: "AI Analysis", status: user?.resumeStatus === "ANALYZED" ? "complete" : user?.hasResume ? "current" : "upcoming", icon: BrainCircuit, href: "/resume" },
    { id: 3, name: "Curriculum Roadmap", status: hasRoadmap ? "complete" : user?.resumeStatus === "ANALYZED" ? "current" : "upcoming", icon: Map, href: "/roadmap" },
    { id: 4, name: "Daily Study Session", status: todaySession?.status === "COMPLETED" ? "complete" : hasRoadmap ? "current" : "upcoming", icon: CalendarDays, href: "/today" },
    { id: 5, name: "Interactive Practice", status: (dashboardStats?.practiceQuestions || 0) > 0 ? "complete" : "upcoming", icon: Dumbbell, href: "/practice" },
    { id: 6, name: "Interview Readiness", status: (dashboardStats?.averageScore || 0) >= 80 ? "complete" : "upcoming", icon: Target, href: "#" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* 1. Hero Greeting Banner (AI Gorilla OS / TalentsPro Signature) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-2xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] relative overflow-hidden group">
        {/* Ambient radial aurora blooms */}
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-br from-primary/10 via-purple-500/5 to-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -mb-28" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="h-3 w-3" />
                Adaptive AI Engine Active
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                🎯 Target: {roadmapData?.targetRole || "Full Stack Engineer"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                Level 1 Candidate
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {greeting}, {displayName}! 👋
              </h1>
              <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
                Your personalized interview preparation curriculum is calibrated and ready. Complete today&apos;s active modules to maintain your momentum.
              </p>
            </div>

            {/* Gorilla OS Pill Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={hasRoadmap ? "/today" : "/roadmap"}>
                <button className="rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] px-8 py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  {todaySession?.status === "COMPLETED" ? "Review Today's Session" : "Start Today's Session"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              
              <Link href="/practice">
                <button className="rounded-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold uppercase tracking-widest text-[11px] px-7 py-3.5 border border-slate-200/90 shadow-soft transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-teal-600" />
                  Practice Questions
                </button>
              </Link>

              <Link href="/roadmap">
                <button className="rounded-full bg-transparent hover:bg-slate-100/60 text-slate-600 font-bold uppercase tracking-widest text-[10px] px-5 py-3 transition-colors flex items-center gap-1.5">
                  <Map className="h-3.5 w-3.5 text-slate-500" />
                  Full Curriculum
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: Hero Visual Circular Metric Gauge */}
          <div className="shrink-0 flex items-center justify-center lg:justify-end">
            <div className="p-6 rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex items-center gap-6 min-w-[280px]">
              <CircularProgress 
                value={dashboardStats?.averageScore || 0} 
                size={88} 
                strokeWidth={8} 
                fontSize="text-2xl font-black text-slate-900"
                strokeClassName="text-primary"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Interview Readiness
                </span>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {Math.round(dashboardStats?.averageScore || 0)}%
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-700">
                    Target: 85% Benchmark
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6-step Guided User Flow (Mastery Journey) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-2xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 relative z-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Compass className="h-3 w-3" />
              Onboarding & Curriculum Path
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
              className="h-full bg-gradient-to-r from-emerald-500 via-primary to-teal-500 transition-all duration-700 rounded-full"
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

      {/* 3. The 4 Gorilla-OS Visual Stat Cards (Multi-Metric Density) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Interview Readiness Index */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] hover:border-primary/30 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Readiness Index
            </span>
            <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <BrainCircuit className="h-4 w-4" />
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 my-2">
            <div>
              <div className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
                {Math.round(dashboardStats?.averageScore || 0)}%
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                Target: 85% hiring bar
              </p>
            </div>
            <CircularProgress 
              value={dashboardStats?.averageScore || 0}
              size={56}
              strokeWidth={6}
              fontSize="text-xs font-black"
              strokeClassName="text-primary"
            />
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="h-3 w-3" /> Calibrated
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Algorithm V2
            </span>
          </div>
        </motion.div>

        {/* Card 2: Curriculum Topic Mastery */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Curriculum Mastery
            </span>
            <div className="h-8 w-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
              <Layers className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 my-2">
            <div>
              <div className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
                {completedTopics}/{totalTopics}
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                Topics mastered
              </p>
            </div>
            <CircularProgress 
              value={curriculumPercentage}
              size={56}
              strokeWidth={6}
              fontSize="text-xs font-black"
              strokeClassName="text-teal-600"
            />
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${curriculumPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Consistency Streak & 7-Day Visual Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Consistency Streak
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Flame className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 my-2">
            <div>
              <div className="text-3xl font-black tracking-tight text-slate-900 tabular-nums flex items-center gap-1.5">
                {dashboardStats?.currentStreak || 0}
                <span className="text-sm font-bold text-slate-500">Days</span>
                <span className="text-lg">🔥</span>
              </div>
              <p className="text-[11px] font-medium text-amber-600 mt-1">
                +150 XP bonus unlocked
              </p>
            </div>
          </div>

          {/* 7-Day Mini Tracker Dots */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === currentDayIndex;
              const isPastActive = idx <= currentDayIndex && idx >= currentDayIndex - streakCount + 1;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400">{day}</span>
                  <div className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all",
                    isPastActive && "bg-amber-500 text-white shadow-sm shadow-amber-500/30",
                    isToday && !isPastActive && "border-2 border-amber-500 text-amber-600 animate-pulse",
                    !isPastActive && !isToday && "bg-slate-100 text-slate-400"
                  )}>
                    {isPastActive ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Card 4: Accuracy Balance (Coding vs Theory) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Accuracy Balance
            </span>
            <div className="h-8 w-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Code2 className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3 my-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Coding Problems
                </span>
                <span className="font-extrabold text-slate-900">{Math.round(dashboardStats?.codingAccuracy || 0)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(dashboardStats?.codingAccuracy || 0)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-teal-500" /> Theory & Arch
                </span>
                <span className="font-extrabold text-slate-900">{Math.round(dashboardStats?.theoryAccuracy || 0)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(dashboardStats?.theoryAccuracy || 0)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Balanced Profile
            </span>
            <span className="text-[11px] font-bold text-slate-600">
              {dashboardStats?.practiceQuestions || 0} Solved
            </span>
          </div>
        </motion.div>
      </div>

      {/* 4. Bottom Section: Today's Focus Session & Skill Radar */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Focus Card */}
          <div className="h-full rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-primary/10 transition-all duration-500" />
            
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
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
                    <div className="text-right flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-teal-700">
                        <Clock className="h-3 w-3" />
                        60 mins
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Curriculum Progression</span>
                      <span className="text-primary font-bold">
                        {todaySession.status === "COMPLETED" ? "100%" : "33%"}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-teal-500 transition-all duration-500 rounded-full" 
                        style={{ width: todaySession.status === "COMPLETED" ? "100%" : "33%" }} 
                      />
                    </div>
                  </div>

                  {/* 3 Active Unit Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Unit 1</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">Algorithms & Structures</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">20 min practice</p>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Unit 2</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">System Architecture</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">25 min analysis</p>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Unit 3</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">Behavioral Flashcard</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">15 min review</p>
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
                  <h3 className="text-lg font-bold text-slate-900">No Active Session Generated</h3>
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
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
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
                    <p className="text-xs font-bold text-slate-900">Candidate Onboarding</p>
                    <p className="text-[10px] text-slate-500">Welcome to CareerOS!</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</span>
              </div>
              
              {user?.hasResume ? (
                <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Resume Analyzed</p>
                      <p className="text-[10px] text-slate-500">Target role calibrated</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ready</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div>
                      <p className="text-xs font-medium text-slate-600">Upload your resume</p>
                      <p className="text-[10px] text-slate-400">Unlock custom roadmap</p>
                    </div>
                  </div>
                  <Link href="/resume" className="text-[10px] font-bold text-primary hover:underline">
                    Upload →
                  </Link>
                </div>
              )}

              {hasRoadmap && (
                <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-teal-500 shadow-sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Roadmap Generated</p>
                      <p className="text-[10px] text-slate-500">{roadmapData?.title || "Custom curriculum"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
