import { CheckCircle2, Circle } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: string;
  masteryPercentage?: number;
  nextReviewDate?: string | null;
}

interface Props {
  topics: Topic[];
}

export function TopicList({ topics }: Props) {
  return (
    <div className="space-y-3 mt-4">
      {topics.map((topic, i) => (
        <div key={topic.id || i} className="flex items-start gap-3 p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
          <div className="mt-0.5">
            {topic.status === "COMPLETED" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 w-full overflow-hidden">
            <div className="flex justify-between items-start gap-2">
              <h5 className="font-medium text-sm truncate">{topic.title}</h5>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-background px-1.5 py-0.5 rounded border">
                  ~{topic.estimatedMinutes}m
                </span>
              </div>
            </div>
            {topic.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
            )}
            
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {topic.masteryPercentage !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border
                  ${topic.masteryPercentage >= 80 ? 'bg-success/10 text-success border-success/20' : 
                    topic.masteryPercentage >= 50 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
                    'bg-destructive/10 text-destructive border-destructive/20'}`}
                >
                  Mastery: {topic.masteryPercentage}%
                </span>
              )}

              {(() => {
                const now = new Date();
                const nextReview = topic.nextReviewDate ? new Date(topic.nextReviewDate) : null;
                if (nextReview && nextReview <= now && topic.status !== "PENDING") {
                  return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">Review Due</span>;
                }
                if (topic.masteryPercentage !== undefined && topic.masteryPercentage < 50 && topic.status !== "PENDING") {
                  return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">Weak</span>;
                }
                if (topic.masteryPercentage !== undefined && topic.masteryPercentage >= 80 && topic.status !== "PENDING") {
                  return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Strong</span>;
                }
                return null;
              })()}

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
