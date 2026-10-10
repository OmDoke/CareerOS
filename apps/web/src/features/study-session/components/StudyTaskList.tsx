"use client";

import { Circle, CheckCircle2, RotateCw, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasks: any[];
}

export function StudyTaskList({ tasks }: Props) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-white">Today&apos;s Focus Topics</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Curriculum Units</span>
      </div>
      <div className="rounded-3xl border border-white/10 divide-y divide-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden shadow-soft">
        {tasks.map((task, i) => (
          <div key={task.id || i} className="p-5 flex items-start gap-4 hover:bg-white/[0.04] transition-colors">
            <div className="mt-1 flex-shrink-0">
              {task.status === "COMPLETED" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <Circle className="h-6 w-6 text-slate-500 opacity-60" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-lg text-white">{task.title}</h4>
                  {task.topic && (() => {
                    const now = new Date();
                    const nextReview = task.topic.nextReviewDate ? new Date(task.topic.nextReviewDate) : null;
                    if (nextReview && nextReview <= now && task.topic.status !== "PENDING") {
                      return <Badge variant="secondary" className="bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] uppercase font-bold tracking-wider"><RotateCw className="h-3 w-3 mr-1"/> Review Due</Badge>;
                    } else if (task.topic.masteryPercentage < 50 && task.topic.status !== "PENDING") {
                      return <Badge variant="destructive" className="bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] uppercase font-bold tracking-wider"><AlertTriangle className="h-3 w-3 mr-1"/> Weak Topic</Badge>;
                    } else if (task.topic.status === "PENDING") {
                      return <Badge variant="secondary" className="bg-primary/20 text-purple-200 border border-primary/30 text-[10px] uppercase font-bold tracking-wider"><Sparkles className="h-3 w-3 mr-1"/> New</Badge>;
                    }
                    return null;
                  })()}
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 bg-white/[0.06] border border-white/10 px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                  {task.estimatedMinutes} mins
                </span>
              </div>
              {task.topic?.description && (
                <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
                  {task.topic.description}
                </p>
              )}
              {task.status !== "COMPLETED" && (
                <div className="mt-4">
                  <Link 
                    href={`/practice?sessionId=${task.sessionId}&taskId=${task.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[10px] px-6 py-2.5 shadow-md shadow-primary/25 border border-white/15 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Start Practice →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
