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
        <h3 className="text-xl font-bold tracking-tight text-slate-900">Today&apos;s Focus Topics</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Curriculum Units</span>
      </div>
      <div className="rounded-3xl border border-slate-200/80 divide-y divide-slate-100 bg-white/85 backdrop-blur-xl overflow-hidden shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
        {tasks.map((task, i) => (
          <div key={task.id || i} className="p-5 flex items-start gap-4 hover:bg-slate-50/70 transition-colors">
            <div className="mt-1 flex-shrink-0">
              {task.status === "COMPLETED" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <Circle className="h-6 w-6 text-slate-400 opacity-60" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-lg text-slate-900">{task.title}</h4>
                  {task.topic && (() => {
                    const now = new Date();
                    const nextReview = task.topic.nextReviewDate ? new Date(task.topic.nextReviewDate) : null;
                    if (nextReview && nextReview <= now && task.topic.status !== "PENDING") {
                      return <Badge variant="secondary" className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] uppercase font-bold tracking-wider"><RotateCw className="h-3 w-3 mr-1"/> Review Due</Badge>;
                    } else if (task.topic.masteryPercentage < 50 && task.topic.status !== "PENDING") {
                      return <Badge variant="destructive" className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] uppercase font-bold tracking-wider"><AlertTriangle className="h-3 w-3 mr-1"/> Weak Topic</Badge>;
                    } else if (task.topic.status === "PENDING") {
                      return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] uppercase font-bold tracking-wider"><Sparkles className="h-3 w-3 mr-1"/> New</Badge>;
                    }
                    return null;
                  })()}
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100/90 border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                  {task.estimatedMinutes} mins
                </span>
              </div>
              {task.topic?.description && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-2xl">
                  {task.topic.description}
                </p>
              )}
              {task.status !== "COMPLETED" && (
                <div className="mt-4">
                  <Link 
                    href={`/practice?sessionId=${task.sessionId}&taskId=${task.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[10px] px-6 py-2.5 shadow-md shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95"
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
