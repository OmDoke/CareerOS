"use client";

import { useTodaySession, useGenerateSession } from "../../features/study-session/hooks/useStudySession";
import { TodaySessionCard } from "../../features/study-session/components/TodaySessionCard";
import { StudyTaskList } from "../../features/study-session/components/StudyTaskList";
import { SessionProgress } from "../../features/study-session/components/SessionProgress";
import { CompleteSessionButton } from "../../features/study-session/components/CompleteSessionButton";
import { Button } from "../../components/ui/button";
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
    return (
      <>
        <SpinnerSkeleton />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <div className="animate-in fade-in duration-500">
          <PageHeader 
            title="Today's Study Session"
            description="Your daily personalized curriculum tasks."
            breadcrumbItems={[{ label: "Today" }]}
          />
          <div className="max-w-2xl mx-auto mt-12">
            <EmptyState
              icon={CalendarCheck}
              title="No Session for Today"
              description="Generate today's study session to know exactly what topics to focus on based on your roadmap."
            >
              <div className="mt-8 flex flex-col items-center gap-4 w-full">
                <Button
                  onClick={() => generateSession.mutate()}
                  disabled={generateSession.isPending}
                  size="lg"
                  className="w-full sm:w-auto shadow-md"
                >
                  {generateSession.isPending ? (
                    "Generating..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                      Start Today's Session
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Need a roadmap first? <Link href="/roadmap" className="text-primary hover:underline font-medium">Go to Roadmap</Link>
                </p>
              </div>
            </EmptyState>
          </div>
        </div>
      </>
    );
  }

  const completedTasks = session.tasks?.filter((t: any) => t.status === "COMPLETED").length ?? 0;
  const totalTasks = session.tasks?.length ?? 0;
  const isCompleted = session.status === "COMPLETED";
  const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;
  const remainingTasks = totalTasks - completedTasks;
  const estimatedRemainingMins = remainingTasks * 15; // Assume 15 mins per task
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-8">
        <PageHeader 
          title="Today's Study Session"
          description={new Date(session.sessionDate).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
          breadcrumbItems={[{ label: "Today" }]}
          action={
            !isCompleted && !allTasksDone && (
              <div className="hidden sm:flex items-center gap-2 bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-full border shadow-sm text-sm font-medium">
                <Clock className="h-4 w-4" />
                ~{estimatedRemainingMins} mins remaining
              </div>
            )
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Tasks Completed" value={`${completedTasks} / ${totalTasks}`} icon={Target} />
          <StatCard title="Progress" value={`${progressPercent}%`} icon={Clock} />
          <StatCard title="XP Reward" value="+150 XP" icon={Trophy} description="Earned upon completion" />
        </div>

        {(isCompleted || allTasksDone) ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-12 border rounded-2xl bg-success/10 border-success/20 mb-8 shadow-sm"
          >
            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mb-6 ring-8 ring-success/10">
              <CalendarCheck className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-2">You're all done for today!</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
              Great job completing your study session. Come back tomorrow for your next customized curriculum tasks.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="shadow-md">Back to Dashboard</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <TodaySessionCard session={session} />
            <SessionProgress completed={completedTasks} total={totalTasks} />
            <StudyTaskList tasks={session.tasks ?? []} />

            <div className="mt-8 flex justify-end">
              <CompleteSessionButton sessionId={session.id} />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
