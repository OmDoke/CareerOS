"use client";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { useTodaySession, useGenerateSession } from "../../features/study-session/hooks/useStudySession";
import { TodaySessionCard } from "../../features/study-session/components/TodaySessionCard";
import { StudyTaskList } from "../../features/study-session/components/StudyTaskList";
import { SessionProgress } from "../../features/study-session/components/SessionProgress";
import { CompleteSessionButton } from "../../features/study-session/components/CompleteSessionButton";
import { Button } from "../../components/ui/button";
import { Loader2, CalendarCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TodayPage() {
  const { data: session, isLoading } = useTodaySession();
  const generateSession = useGenerateSession();

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading today&apos;s session...</p>
        </div>
      </ProtectedLayout>
    );
  }

  if (!session) {
    return (
      <ProtectedLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center text-center p-12 border rounded-xl bg-card">
            <CalendarCheck className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Session for Today</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Generate today&apos;s study session to know exactly what topics to focus on based on your roadmap.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={() => generateSession.mutate()}
                disabled={generateSession.isPending}
                size="lg"
                className="flex items-center gap-2"
              >
                {generateSession.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="h-4 w-4 text-yellow-300" /> Start Today&apos;s Session</>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Need a roadmap first? <Link href="/roadmap" className="text-primary hover:underline">Go to Roadmap</Link>
              </p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedTasks = session.tasks?.filter((t: any) => t.status === "COMPLETED").length ?? 0;
  const totalTasks = session.tasks?.length ?? 0;
  const isCompleted = session.status === "COMPLETED";
  const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;
  const remainingTasks = totalTasks - completedTasks;
  const estimatedRemainingMins = remainingTasks * 15; // Assume 15 mins per task

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today&apos;s Study Session</h1>
          <p className="text-muted-foreground mt-1">
            {new Date(session.sessionDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {!isCompleted && !allTasksDone && (
          <div className="bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium border shadow-sm">
            ~{estimatedRemainingMins} mins remaining
          </div>
        )}
      </div>

      {(isCompleted || allTasksDone) ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border rounded-xl bg-card border-green-500/20 mb-8">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CalendarCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">You're all done for today!</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Great job completing your study session. Come back tomorrow for your next customized curriculum tasks.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      ) : (
        <>
          <TodaySessionCard session={session} />
          <SessionProgress completed={completedTasks} total={totalTasks} />
          <StudyTaskList tasks={session.tasks ?? []} />

          <div className="mt-8 flex justify-end">
            <CompleteSessionButton sessionId={session.id} />
          </div>
        </>
      )}
    </div>
  );
}
