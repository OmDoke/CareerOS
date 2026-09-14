"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { 
  useGenerateQuestion, 
  useSkipQuestion, 
  useQuestionHint, 
  useQuestionExplanation 
} from "../../features/practice/hooks/useQuestions";
import { QuestionCard } from "../../features/practice/components/QuestionCard";
import { Button } from "../../components/ui/button";
import { Loader2, AlertCircle, Lightbulb, SkipForward, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { QuestionSkeleton } from "@/components/shared/LoadingSkeleton";

export default function PracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sessionId = searchParams.get("sessionId");
  const taskId = searchParams.get("taskId");

  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questionData, setQuestionData] = useState<any>(null);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  
  const [hint, setHint] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const generateQuestion = useGenerateQuestion();
  const skipQuestion = useSkipQuestion();
  const getHint = useQuestionHint();
  const getExplanation = useQuestionExplanation();

  if (!sessionId || !taskId) {
    return (
      <ProtectedLayout>
        <div className="animate-in fade-in duration-500">
          <PageHeader 
            title="Interview Practice"
            description="Master your skills with AI-generated dynamic questions."
            breadcrumbItems={[{ label: "Practice" }]}
          />
          <div className="max-w-2xl mx-auto mt-12">
            <EmptyState
              icon={AlertCircle}
              title="No Topic Selected"
              description="To start practicing, please select a specific topic from your daily study session."
              primaryAction={{
                label: "Go to Today's Plan",
                onClick: () => router.push("/today")
              }}
              secondaryAction={{
                label: "Back to Dashboard",
                href: "/dashboard"
              }}
            />
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  const handleNextQuestion = () => {
    setHint(null);
    setExplanation(null);
    setSelectedOption(null);
    setTextAnswer("");
    setQuestionData(null);
    
    generateQuestion.mutate({ sessionId, taskId }, {
      onSuccess: (data) => {
        setCurrentAttemptId(data.attemptId);
        setQuestionData(data.question);
      }
    });
  };

  const handleSkip = () => {
    if (!currentAttemptId) return;
    skipQuestion.mutate({ attemptId: currentAttemptId }, {
      onSuccess: () => {
        handleNextQuestion();
      }
    });
  };

  const handleGetHint = () => {
    if (!currentAttemptId) return;
    const currentAnswer = questionData?.options ? selectedOption : textAnswer;
    getHint.mutate({ attemptId: currentAttemptId, userAnswer: currentAnswer }, {
      onSuccess: (data) => setHint(data.hint)
    });
  };

  const handleGetExplanation = () => {
    if (!currentAttemptId) return;
    getExplanation.mutate({ attemptId: currentAttemptId }, {
      onSuccess: (data) => setExplanation(data.explanation)
    });
  };

  // Initial load state
  if (!questionData && !generateQuestion.isPending) {
    return (
      <ProtectedLayout>
        <div className="animate-in fade-in duration-500">
          <PageHeader 
            title="Interview Practice"
            description="Dynamic AI questions tailored to your current topic."
            breadcrumbItems={[
              { label: "Today", href: "/today" },
              { label: "Practice" }
            ]}
          />
          <div className="max-w-2xl mx-auto mt-12">
            <EmptyState
              icon={Lightbulb}
              title="Ready to Practice?"
              description="Our AI will generate a dynamic interview question tailored to your current topic, target role, and past performance."
              primaryAction={{
                label: "Generate First Question",
                onClick: handleNextQuestion
              }}
            />
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {generateQuestion.isPending ? (
          <QuestionSkeleton />
        ) : questionData ? (
          <div className="space-y-6">
            <QuestionCard 
              question={questionData.question}
              type={questionData.type}
              difficulty={questionData.difficulty}
              codeSnippet={questionData.codeSnippet}
              options={questionData.options}
              selectedOption={selectedOption}
              onOptionSelect={setSelectedOption}
            />

            {!questionData.options && (
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-medium mb-3 text-lg">Your Answer</h3>
                <textarea 
                  className="w-full min-h-[200px] p-4 rounded-lg border bg-background/50 focus:bg-background resize-y transition-colors focus:ring-2 focus:ring-primary focus:outline-none text-base"
                  placeholder="Type your answer or code here..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6 bg-card border rounded-xl p-4 shadow-sm">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={handleGetHint} 
                  disabled={getHint.isPending}
                  className="flex-1 sm:flex-none"
                >
                  {getHint.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                  Get Hint
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGetExplanation}
                  disabled={getExplanation.isPending}
                  className="flex-1 sm:flex-none"
                >
                  {getExplanation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                  Explain Concept
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button variant="secondary" onClick={handleSkip} disabled={skipQuestion.isPending} className="flex-1 sm:flex-none">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip
                </Button>
                <Button onClick={() => alert("Submit Answer will be implemented in Phase 8")} className="flex-1 sm:flex-none">
                  Submit Answer
                </Button>
              </div>
            </div>

            {hint && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mt-4">
                <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400 font-semibold">
                  <Lightbulb className="h-5 w-5" />
                  <h3>AI Hint</h3>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-blue-900 dark:text-blue-200">
                  <ReactMarkdown>{hint}</ReactMarkdown>
                </div>
              </div>
            )}

            {explanation && (
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg p-6 mt-4">
                <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-400 font-semibold">
                  <BookOpen className="h-5 w-5" />
                  <h3>Conceptual Explanation</h3>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-purple-900 dark:text-purple-200">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </ProtectedLayout>
  );
}
