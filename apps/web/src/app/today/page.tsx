"use client";

import { useTodaySession, useGenerateSession } from "../../features/study-session/hooks/useStudySession";
import { TodaySessionCard } from "../../features/study-session/components/TodaySessionCard";
import { StudyTaskList } from "../../features/study-session/components/StudyTaskList";
import { SessionProgress } from "../../features/study-session/components/SessionProgress";
import { CompleteSessionButton } from "../../features/study-session/components/CompleteSessionButton";
import { CalendarCheck, Sparkles, Trophy, Clock, Target } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import * as motion from "framer-motion/client";
import { StatCard } from "@/components/shared/StatCard";

export default function TodayPage() {
  const { data: session, isLoading } = useTodaySession();
  const generateSession = useGenerateSession();

  if (isLoading) {
    return <SpinnerSkeleton />;
  }

  if (!session) {
    return (
      <div className="animate-in fade-in duration-300">
        <PageHeader
          title="Today's Session"
          description="Your daily personalized curriculum."
          breadcrumbItems={[{ label: "Today" }]}
        />
        <div className="max-w-xl mx-auto mt-10">
          <EmptyState
            icon={CalendarCheck}
            title="No session yet"
            description="Generate today's study session to get a set of calibrated questions based on your roadmap and current readiness score."
          >
            <div className="mt-2 flex flex-col items-center gap-3 w-full">
              <button
                onClick={() => generateSession.mutate()}
                disabled={generateSession.isPending}
                className="btn-primary px-8 py-3 text-sm w-full sm:w-auto"
              >
                {generateSession.isPending ? (
                  <>
                    <span
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate session
                  </>
                )}
              </button>
              <p className="text-xs text-[var(--fg-muted)]">
                Need a roadmap first?{" "}
                <Link href="/roadmap" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
                  Go to roadmap
                </Link>
              </p>
            </div>
          </EmptyState>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedTasks = session.tasks?.filter((t: any) => t.status === "COMPLETED").length ?? 0;
  const totalTasks = session.tasks?.length ?? 0;
  const isCompleted = session.status === "COMPLETED";
  const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;
  const remainingTasks = totalTasks - completedTasks;
  const estimatedRemainingMins = remainingTasks * 15;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <PageHeader
        title="Today's Session"
        description={new Date(session.sessionDate).toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })}
        breadcrumbItems={[{ label: "Today" }]}
        action={
          !isCompleted && !allTasksDone ? (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-sunken)",
                borderColor: "var(--border)",
                color: "var(--fg-secondary)",
              }}
            >
              <Clock className="h-3.5 w-3.5" />
              ~{estimatedRemainingMins} min remaining
            </div>
          ) : null
        }
      />

      {/* Stat row */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tasks Completed" value={`${completedTasks} / ${totalTasks}`} icon={Target} accentColor="accent" />
        <StatCard title="Progress" value={`${progressPercent}%`} icon={Clock} accentColor="ok" />
        <StatCard title="XP Reward" value="+150 XP" icon={Trophy} description="Earned upon completion" accentColor="muted" />
      </div>

      {(isCompleted || allTasksDone) ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="card p-12 flex flex-col items-center justify-center text-center"
        >
          <div
            className="h-16 w-16 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: "var(--ok-dim)", color: "var(--ok)" }}
          >
            <CalendarCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
            All done for today.
          </h2>
          <p className="text-sm text-[var(--fg-secondary)] mb-7 max-w-sm">
            Come back tomorrow for your next session. Your readiness score has been updated.
          </p>
          <Link href="/dashboard">
            <button className="btn-primary px-7 py-2.5 text-sm">Back to dashboard</button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <TodaySessionCard session={session} />
          <SessionProgress completed={completedTasks} total={totalTasks} />
          <StudyTaskList tasks={session.tasks ?? []} />

          <div className="flex justify-end mt-4">
            <CompleteSessionButton sessionId={session.id} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
