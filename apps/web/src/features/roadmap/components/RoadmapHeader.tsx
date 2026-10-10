"use client";

import { Target, Clock, Trophy, Sparkles } from "lucide-react";
import { GenerateRoadmapButton } from "./GenerateRoadmapButton";

interface Props {
  title: string;
  targetRole: string;
  currentLevel: string;
  estimatedWeeks: number;
}

export function RoadmapHeader({ title, targetRole, currentLevel, estimatedWeeks }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3" />
            Active Curriculum
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            AI Generated
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-2 mb-3">{title}</h1>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <Target className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-slate-700">Target Role:</span>
            <span className="font-extrabold text-slate-900">{targetRole}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700">Level:</span>
            <span className="font-extrabold text-slate-900">{currentLevel}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <Clock className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-semibold text-slate-700">Duration:</span>
            <span className="font-extrabold text-slate-900">{estimatedWeeks} Weeks</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 shrink-0">
        <GenerateRoadmapButton force={true} initialRole={targetRole} />
      </div>
    </div>
  );
}
