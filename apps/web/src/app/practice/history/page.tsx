"use client";

import { useQuestionHistory } from "../../../features/practice/hooks/useEvaluateAnswer";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock, Code2, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PracticeHistoryPage() {
  const { data: history, isLoading } = useQuestionHistory();

  if (isLoading) return <SpinnerSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Practice History" 
        description="Review your past performance and AI feedback."
        breadcrumbItems={[
          { label: "Practice", href: "/practice" },
          { label: "History" }
        ]}
      />

      <div className="grid gap-4">
        {history?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No practice attempts yet.</p>
          </div>
        ) : (
          history?.map((attempt: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <Card key={attempt.id} className="overflow-hidden transition-all hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={attempt.overallScore >= 80 ? "default" : attempt.overallScore >= 50 ? "secondary" : "destructive"}>
                        Score: {attempt.overallScore || 0}%
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal">
                        {attempt.questionType === "CODE" ? <Code2 className="h-3 w-3 mr-1" /> : <BookOpen className="h-3 w-3 mr-1" />}
                        {attempt.questionType}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center ml-auto md:ml-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(attempt.submittedAt || attempt.createdAt))} ago
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-2">{attempt.topic?.title || "General Topic"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {attempt.question ? JSON.parse(attempt.question).question : ""}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px] bg-secondary/20 p-4 rounded-lg">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="line-clamp-2 text-muted-foreground">{attempt.strengths ? JSON.parse(attempt.strengths)[0] || "Good attempt." : "Good attempt."}</span>
                    </div>
                    {attempt.mistakes && JSON.parse(attempt.mistakes).length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-2 text-muted-foreground">{JSON.parse(attempt.mistakes)[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
