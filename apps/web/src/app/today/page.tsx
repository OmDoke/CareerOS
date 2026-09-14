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

  return (
    <ProtectedLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
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

        <TodaySessionCard session={session} />

        <SessionProgress completed={completedTasks} total={totalTasks} />

        <StudyTaskList tasks={session.tasks ?? []} />

        {!isCompleted && (
          <div className="mt-8 flex justify-end">
            <CompleteSessionButton sessionId={session.id} />
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
