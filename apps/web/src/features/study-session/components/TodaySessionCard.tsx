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
    <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-2xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] mb-8 relative overflow-hidden">
      {/* Ambient gradient flare */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5 flex items-center gap-1.5">
            Current Module
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{currentModule?.title || "Daily Study"}</h2>
          <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
            {currentModule?.description || "Let's make progress on your learning roadmap today."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px] w-full md:w-auto">
          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 px-4 py-3 rounded-2xl backdrop-blur-md shadow-sm">
            <div className="h-9 w-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Estimated Time</div>
              <div className="font-extrabold text-slate-900 text-sm">{estimatedMinutes} mins</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 px-4 py-3 rounded-2xl backdrop-blur-md shadow-sm">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Questions</div>
              <div className="font-extrabold text-slate-900 text-sm">{completedQuestions} / {totalQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      {status === "COMPLETED" && (
        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 w-fit px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Session Completed!
        </div>
      )}
    </div>
  );
}
