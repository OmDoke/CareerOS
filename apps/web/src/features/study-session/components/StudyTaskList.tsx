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
      <h3 className="text-xl font-bold tracking-tight mb-4">Today&apos;s Topics</h3>
      <div className="border rounded-xl divide-y bg-card overflow-hidden">
        {tasks.map((task, i) => (
          <div key={task.id || i} className="p-4 flex items-start gap-4 hover:bg-secondary/20 transition-colors">
            <div className="mt-1 flex-shrink-0">
              {task.status === "COMPLETED" ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground opacity-50" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-lg">{task.title}</h4>
                  {task.topic && (() => {
                    const now = new Date();
                    const nextReview = task.topic.nextReviewDate ? new Date(task.topic.nextReviewDate) : null;
                    if (nextReview && nextReview <= now && task.topic.status !== "PENDING") {
                      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><RotateCw className="h-3 w-3 mr-1"/> Review Due</Badge>;
                    } else if (task.topic.masteryPercentage < 50 && task.topic.status !== "PENDING") {
                      return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><AlertTriangle className="h-3 w-3 mr-1"/> Weak Topic</Badge>;
                    } else if (task.topic.status === "PENDING") {
                      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"><Sparkles className="h-3 w-3 mr-1"/> New</Badge>;
                    }
                    return null;
                  })()}
                </div>
                <span className="text-sm text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md whitespace-nowrap">
                  {task.estimatedMinutes} mins
                </span>
              </div>
              {task.topic?.description && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {task.topic.description}
                </p>
              )}
              {task.status !== "COMPLETED" && (
                <div className="mt-4">
                  <Link 
                    href={`/practice?sessionId=${task.sessionId}&taskId=${task.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Start Practice
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
