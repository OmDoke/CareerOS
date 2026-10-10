import { DifficultyBadge } from "./DifficultyBadge";
import { TopicList } from "./TopicList";
import { BookOpen, Clock } from "lucide-react";

interface ModuleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
  index: number;
}

export function ModuleCard({ module, index }: ModuleProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 p-6 md:p-8 bg-white/85 backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] relative overflow-hidden group hover:border-primary/30 hover:shadow-hover transition-all duration-300">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-purple-500 to-teal-500" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-teal-700">
            <span className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
              Module {index + 1}
            </span>
            <span className="text-slate-500 font-semibold">• {module.category}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-1">{module.title}</h3>
        </div>
        <DifficultyBadge level={module.difficulty} />
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed relative z-10">{module.description}</p>

      <div className="flex items-center gap-6 text-xs text-slate-500 mb-5 pb-5 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-600" />
          <span className="font-semibold text-slate-800">{module.estimatedHours} Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-semibold text-slate-800">{module.topics?.length || 0} Topics</span>
        </div>
      </div>

      <div className="relative z-10">
        <TopicList topics={module.topics || []} />
      </div>
    </div>
  );
}
