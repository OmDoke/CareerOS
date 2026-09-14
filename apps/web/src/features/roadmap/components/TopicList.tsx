import { CheckCircle2, Circle } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: string;
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
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <h5 className="font-medium text-sm">{topic.title}</h5>
              <span className="text-xs text-muted-foreground whitespace-nowrap bg-background px-1.5 py-0.5 rounded">
                ~{topic.estimatedMinutes}m
              </span>
            </div>
            {topic.description && (
              <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
