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
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold">Missing Context</h2>
          <p className="text-muted-foreground mt-2 mb-4">Please start practice from today's study session.</p>
          <Button onClick={() => router.push("/today")}>Go to Today's Plan</Button>
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
        <div className="container max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Ready to Practice?</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-lg">
            Our AI will generate a dynamic interview question tailored to your current topic, target role, and past performance.
          </p>
          <Button size="lg" onClick={handleNextQuestion}>
            Generate First Question
          </Button>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {generateQuestion.isPending ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is crafting your question...</p>
          </div>
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
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-medium mb-3">Your Answer</h3>
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-md border bg-background resize-y"
                  placeholder="Type your answer or code here..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={handleGetHint} 
                disabled={getHint.isPending}
              >
                {getHint.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                Get Hint
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGetExplanation}
                disabled={getExplanation.isPending}
              >
                {getExplanation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                Explain Concept
              </Button>
              <div className="flex-1" />
              <Button variant="secondary" onClick={handleSkip} disabled={skipQuestion.isPending}>
                <SkipForward className="h-4 w-4 mr-2" />
                Skip
              </Button>
              <Button onClick={() => alert("Submit Answer will be implemented in Phase 8")}>
                Submit Answer
              </Button>
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
