"use client";

import { Clock, BookOpen, CheckCircle2 } from "lucide-react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

export function TodaySessionCard({ session }: Props) {
  if (!session) return null;

  const { currentModule, estimatedMinutes, totalQuestions, completedQuestions, status } = session;

  return (
    <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-primary-foreground/80 text-sm font-medium mb-1">
            Current Module
          </div>
          <h2 className="text-2xl font-bold mb-2">{currentModule?.title || "Daily Study"}</h2>
          <p className="text-primary-foreground/90 text-sm max-w-xl">
            {currentModule?.description || "Let's make progress on your learning roadmap today."}
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2.5 rounded-lg">
            <Clock className="h-5 w-5 opacity-80" />
            <div>
              <div className="text-xs opacity-80">Estimated Time</div>
              <div className="font-semibold">{estimatedMinutes} mins</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2.5 rounded-lg">
            <BookOpen className="h-5 w-5 opacity-80" />
            <div>
              <div className="text-xs opacity-80">Questions</div>
              <div className="font-semibold">{completedQuestions} / {totalQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      {status === "COMPLETED" && (
        <div className="mt-6 flex items-center gap-2 text-sm font-medium bg-green-500/20 text-green-100 w-fit px-3 py-1.5 rounded-full border border-green-400/30">
          <CheckCircle2 className="h-4 w-4" />
          Session Completed!
        </div>
      )}
    </div>
  );
}
