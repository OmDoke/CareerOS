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
    <div className="border rounded-xl p-6 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/40"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm font-medium text-primary">
            <span className="bg-primary/10 px-2 py-0.5 rounded">Module {index + 1}</span>
            <span className="text-muted-foreground">• {module.category}</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight">{module.title}</h3>
        </div>
        <DifficultyBadge level={module.difficulty} />
      </div>

      <p className="text-muted-foreground text-sm mb-6">{module.description}</p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{module.estimatedHours} Hours</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          <span>{module.topics?.length || 0} Topics</span>
        </div>
      </div>

      <TopicList topics={module.topics || []} />
    </div>
  );
}
