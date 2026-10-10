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
  Flame,
  BrainCircuit,
  Target,
  Zap,
  Clock,
  Check,
  TrendingUp,
  Layers,
  Code2,
  BarChart2,
} from "lucide-react";
import * as motion from "framer-motion/client";
import { CircularProgress } from "@/components/ui/circular-progress";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { SkillRadar } from "../../features/analytics/components/SkillRadar";
import { useRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/* ── Readiness Gauge — the signature element ── */
function ReadinessGauge({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const hiringBar = 85;
  const gap = Math.max(0, hiringBar - score);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div
      className="card p-6 mb-6"
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Interview Readiness Score"
    >
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="eyebrow text-[var(--fg-muted)] mb-1">Interview Readiness</p>
          <div className="flex items-baseline gap-2">
            <span className="stat-number text-5xl font-medium text-[var(--fg-primary)]">
              {displayed}<span className="text-2xl text-[var(--fg-muted)]">%</span>
            </span>
            {gap > 0 ? (
              <span className="text-sm text-[var(--fg-muted)]">
                {gap}pts to hiring bar
              </span>
            ) : (
              <span className="text-sm text-[var(--ok)] font-medium">
                Hiring bar reached ✓
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "var(--ok)" }}>
          <TrendingUp className="h-3.5 w-3.5" />
          Calibrated
        </div>
      </div>

      {/* Gauge bar */}
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: `${score}%`, transition: "width 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />
        {/* Hiring bar marker */}
        <div className="gauge-marker" style={{ left: `${hiringBar}%` }} />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-[var(--fg-muted)]">0%</span>
        <span
          className="text-xs font-medium text-[var(--border-strong)] relative -translate-x-1/2"
          style={{ left: `${hiringBar}%` }}
        >
          85% Hiring Bar
        </span>
        <span className="text-xs text-[var(--fg-muted)]">100%</span>
      </div>
    </div>
  );
}

/* ── Journey step ── */
type StepStatus = "complete" | "current" | "upcoming";
interface JourneyStep {
  id: number;
  name: string;
  status: StepStatus;
  icon: React.ElementType;
  href: string;
}

function JourneyStep({ step, isLast }: { step: JourneyStep; isLast: boolean }) {
  const isLink = step.status !== "upcoming";

  const inner = (
    <div className="flex items-center gap-3 group">
      {/* Step circle */}
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150",
          step.status === "complete" && "border",
          step.status === "current" && "shadow-sm",
          step.status === "upcoming" && "border"
        )}
        style={{
          backgroundColor:
            step.status === "complete"
              ? "var(--ok-dim)"
              : step.status === "current"
              ? "var(--accent)"
              : "var(--bg-sunken)",
          borderColor:
            step.status === "complete"
              ? "color-mix(in srgb, var(--ok) 25%, transparent)"
              : step.status === "upcoming"
              ? "var(--border)"
              : "transparent",
          color:
            step.status === "complete"
              ? "var(--ok)"
              : step.status === "current"
              ? "#ffffff"
              : "var(--fg-muted)",
        }}
      >
        {step.status === "complete" ? (
          <Check className="h-4 w-4 stroke-[2.5]" />
        ) : (
          <step.icon className="h-4 w-4" />
        )}
      </div>

      {/* Label */}
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            step.status === "complete" && "text-[var(--fg-secondary)]",
            step.status === "current" && "text-[var(--fg-primary)]",
            step.status === "upcoming" && "text-[var(--fg-muted)]"
          )}
        >
          {step.name}
        </p>
        <p className="text-xs mt-0.5"
          style={{
            color:
              step.status === "complete"
                ? "var(--ok)"
                : step.status === "current"
                ? "var(--accent)"
                : "var(--fg-muted)",
          }}
        >
          {step.status === "complete" ? "Done" : step.status === "current" ? "In progress" : "Pending"}
        </p>
      </div>

      {/* Connector */}
      {!isLast && (
        <div
          className="flex-1 h-px mx-2"
          style={{
            backgroundColor:
              step.status === "complete" ? "var(--ok)" : "var(--border)",
          }}
        />
      )}
    </div>
  );

  if (isLink) {
    return <Link href={step.href} className="flex-1 min-w-0">{inner}</Link>;
  }
  return <div className="flex-1 min-w-0">{inner}</div>;
}

/* ════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════ */
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: roadmapData, isLoading: isLoadingRoadmap } = useRoadmap();
  const hasRoadmap = !!roadmapData;

  const { data: todaySession, isLoading: isLoadingSession } = useTodaySession(hasRoadmap);
  const { data: dashboardStats, isLoading: isLoadingStats } = useDashboardAnalytics();

  if (isLoadingSession || isLoadingStats || isLoadingRoadmap) {
    return <SpinnerSkeleton />;
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const displayName = user?.firstName || user?.email?.split("@")[0] || "Candidate";

  // Roadmap metrics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalTopics = roadmapData?.modules?.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0) || 24;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedTopics = roadmapData?.modules?.reduce((acc: number, m: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc + (m.topics?.filter((t: any) => t.status === "COMPLETED").length || 0), 0) || 0;
  const curriculumPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Streak tracker
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const streakCount = dashboardStats?.currentStreak || 0;

  // Journey steps
  const steps: JourneyStep[] = [
    { id: 1, name: "Upload Resume", status: user?.hasResume ? "complete" : "current", icon: FileText, href: "/resume" },
    { id: 2, name: "AI Analysis", status: user?.resumeStatus === "ANALYZED" ? "complete" : user?.hasResume ? "current" : "upcoming", icon: BrainCircuit, href: "/resume" },
    { id: 3, name: "Roadmap", status: hasRoadmap ? "complete" : user?.resumeStatus === "ANALYZED" ? "current" : "upcoming", icon: Map, href: "/roadmap" },
    { id: 4, name: "Daily Session", status: todaySession?.status === "COMPLETED" ? "complete" : hasRoadmap ? "current" : "upcoming", icon: CalendarDays, href: "/today" },
    { id: 5, name: "Practice", status: (dashboardStats?.practiceQuestions || 0) > 0 ? "complete" : "upcoming", icon: Dumbbell, href: "/practice" },
    { id: 6, name: "Readiness", status: (dashboardStats?.averageScore || 0) >= 80 ? "complete" : "upcoming", icon: Target, href: "#" },
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* ── 1. Readiness Gauge — signature element, always at top ── */}
      <ReadinessGauge score={dashboardStats?.averageScore || 0} />

      {/* ── 2. Greeting + primary CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="badge"
              style={{
                backgroundColor: "var(--accent-dim)",
                borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
                color: "var(--accent-hover)",
              }}
            >
              <Zap className="h-3 w-3" />
              Target: {roadmapData?.targetRole || "Full Stack Engineer"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
            {greeting}, {displayName}.
          </h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1 max-w-lg">
            {todaySession?.status === "COMPLETED"
              ? "Today's session done — great consistency. Come back tomorrow."
              : hasRoadmap
              ? "Your session is ready. Complete it to keep your streak and readiness score moving."
              : "Start by uploading your resume to generate your personalized curriculum."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href={hasRoadmap ? "/today" : "/roadmap"}>
            <button className="btn-primary px-6 py-2.5 text-sm">
              {todaySession?.status === "COMPLETED" ? "Review session" : "Start session"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
          <Link href="/practice">
            <button className="btn-ghost px-5 py-2.5 text-sm">
              <Dumbbell className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
              Practice
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ── 3. Journey steps ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="card p-6"
      >
        <p className="eyebrow text-[var(--fg-muted)] mb-4">Your path</p>
        <div className="flex items-start gap-0 overflow-x-auto pb-1">
          {steps.map((step, idx) => (
            <JourneyStep key={step.id} step={step} isLast={idx === steps.length - 1} />
          ))}
        </div>
      </motion.div>

      {/* ── 4. Stat cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger">
        {/* Readiness index */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="card card-interactive p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="eyebrow text-[var(--fg-muted)]">Readiness</p>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent-hover)" }}>
              <BrainCircuit className="h-4 w-4" />
            </div>
          </div>
          <div className="stat-number text-3xl font-medium text-[var(--fg-primary)]">
            {Math.round(dashboardStats?.averageScore || 0)}%
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">Target: 85% hiring bar</p>
          <div className="mt-3 h-1 w-full rounded-full bg-[var(--bg-sunken)] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${dashboardStats?.averageScore || 0}%`,
                backgroundColor: "var(--accent)",
                transition: "width 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            />
          </div>
        </motion.div>

        {/* Curriculum mastery */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="card card-interactive p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="eyebrow text-[var(--fg-muted)]">Curriculum</p>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--ok-dim)", color: "var(--ok)" }}>
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="stat-number text-3xl font-medium text-[var(--fg-primary)]">
            {completedTopics}
            <span className="text-lg text-[var(--fg-muted)]">/{totalTopics}</span>
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">Topics mastered</p>
          <div className="mt-3 h-1 w-full rounded-full bg-[var(--bg-sunken)] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${curriculumPct}%`,
                backgroundColor: "var(--ok)",
                transition: "width 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            />
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="card card-interactive p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="eyebrow text-[var(--fg-muted)]">Streak</p>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent-hover)" }}>
              <Flame className="h-4 w-4" style={{ fill: "currentColor" }} />
            </div>
          </div>
          <div className="stat-number text-3xl font-medium text-[var(--fg-primary)] flex items-baseline gap-1.5">
            {dashboardStats?.currentStreak || 0}
            <span className="text-lg text-[var(--fg-muted)] font-normal">days</span>
          </div>
          {/* 7-day dots */}
          <div className="mt-3 flex items-center gap-1.5">
            {daysOfWeek.map((day, idx) => {
              const isPast = idx <= currentDayIndex && idx >= currentDayIndex - streakCount + 1;
              const isToday = idx === currentDayIndex;
              return (
                <div key={idx} className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold text-[var(--fg-muted)] uppercase">{day}</span>
                  <div
                    className="h-4 w-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isPast ? "var(--accent)" : "var(--bg-sunken)",
                      outline: isToday && !isPast ? "2px solid var(--accent)" : "none",
                      outlineOffset: "1px",
                    }}
                  >
                    {isPast && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card card-interactive p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="eyebrow text-[var(--fg-muted)]">Accuracy</p>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-sunken)", color: "var(--fg-secondary)" }}>
              <Code2 className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--fg-secondary)]">Coding</span>
                <span className="stat-number font-medium text-[var(--fg-primary)]">
                  {Math.round(dashboardStats?.codingAccuracy || 0)}%
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-[var(--bg-sunken)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${dashboardStats?.codingAccuracy || 0}%`,
                    backgroundColor: "var(--accent)",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--fg-secondary)]">Theory</span>
                <span className="stat-number font-medium text-[var(--fg-primary)]">
                  {Math.round(dashboardStats?.theoryAccuracy || 0)}%
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-[var(--bg-sunken)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${dashboardStats?.theoryAccuracy || 0}%`,
                    backgroundColor: "var(--ok)",
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--fg-muted)]">{dashboardStats?.practiceQuestions || 0} total answered</p>
          </div>
        </motion.div>
      </div>

      {/* ── 5. Today's session + Skill radar ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* Today session card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="eyebrow text-[var(--fg-muted)] mb-1">Today</p>
              <h2 className="text-base font-semibold text-[var(--fg-primary)]">Study Session</h2>
            </div>
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent-hover)" }}
            >
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>

          {todaySession ? (
            <div className="space-y-5">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[var(--fg-secondary)]">Session progress</span>
                  <span className="stat-number font-medium text-[var(--fg-primary)]">
                    {todaySession.status === "COMPLETED" ? "100%" : "33%"}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-sunken)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: todaySession.status === "COMPLETED" ? "100%" : "33%",
                      backgroundColor: "var(--accent)",
                      transition: "width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                    }}
                  />
                </div>
              </div>

              {/* Session status */}
              <div>
                <p className="text-sm font-medium text-[var(--fg-primary)]">
                  {todaySession.status === "COMPLETED" ? "Session complete — great work." : "Active session"}
                </p>
                <p className="text-xs text-[var(--fg-secondary)] mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {todaySession.status === "COMPLETED" ? "Completed today" : "~45 minutes remaining"}
                </p>
              </div>

              {/* Unit chips */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Unit 1", name: "Algorithms", time: "20 min", color: "var(--accent)" },
                  { label: "Unit 2", name: "System Design", time: "25 min", color: "var(--ok)" },
                  { label: "Unit 3", name: "Behavioural", time: "15 min", color: "var(--fg-muted)" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-lg p-3 border"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-sunken)" }}
                  >
                    <p className="text-xs font-bold mb-1" style={{ color: unit.color }}>{unit.label}</p>
                    <p className="text-xs font-semibold text-[var(--fg-primary)]">{unit.name}</p>
                    <p className="text-xs text-[var(--fg-muted)] mt-0.5">{unit.time}</p>
                  </div>
                ))}
              </div>

              <Link href="/today" className="inline-block">
                <button className="btn-primary px-6 py-2.5 text-sm">
                  {todaySession.status === "COMPLETED" ? "Review session" : "Continue session"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--bg-sunken)", color: "var(--fg-muted)" }}
              >
                <CalendarDays className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--fg-primary)] mb-1">No session yet</p>
              <p className="text-xs text-[var(--fg-secondary)] max-w-xs mb-5">
                {hasRoadmap
                  ? "Generate today's session to get tailored practice questions."
                  : "Upload your resume and generate a roadmap to unlock daily sessions."}
              </p>
              <Link href={hasRoadmap ? "/today" : "/roadmap"}>
                <button className="btn-primary px-6 py-2.5 text-sm">
                  {hasRoadmap ? "Start session" : "Go to roadmap"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Skill Radar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.26 }}
        >
          <SkillRadar stats={dashboardStats} />
        </motion.div>
      </div>

      {/* ── 6. Activity feed ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card p-6"
      >
        <p className="eyebrow text-[var(--fg-muted)] mb-4">Recent activity</p>
        <div className="space-y-2">
          <ActivityRow
            label="Onboarding"
            detail="Welcome to CareerOS"
            status="active"
          />
          {user?.hasResume && (
            <ActivityRow
              label="Resume analysed"
              detail="Target role calibrated"
              status="done"
            />
          )}
          {hasRoadmap && (
            <ActivityRow
              label="Roadmap generated"
              detail={roadmapData?.title || "Custom curriculum"}
              status="done"
            />
          )}
          {todaySession && (
            <ActivityRow
              label="Study session"
              detail={todaySession.status === "COMPLETED" ? "Completed today" : "In progress"}
              status={todaySession.status === "COMPLETED" ? "done" : "active"}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ActivityRow({
  label,
  detail,
  status,
}: {
  label: string;
  detail: string;
  status: "done" | "active" | "pending";
}) {
  const dotColor =
    status === "done" ? "var(--ok)" : status === "active" ? "var(--accent)" : "var(--border-strong)";

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-sunken)] transition-colors">
      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--fg-primary)]">{label}</p>
        <p className="text-xs text-[var(--fg-muted)]">{detail}</p>
      </div>
      <span className="text-xs font-medium" style={{ color: dotColor }}>
        {status === "done" ? "Done" : status === "active" ? "Active" : "Pending"}
      </span>
    </div>
  );
}
