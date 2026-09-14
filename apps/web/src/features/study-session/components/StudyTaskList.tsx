"use client";

import { Circle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
                <h4 className="font-semibold text-lg">{task.title}</h4>
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
