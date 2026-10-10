"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGenerateQuestion,
  useSkipQuestion,
  useQuestionHint,
  useQuestionExplanation
} from "../../features/practice/hooks/useQuestions";
import { useEvaluateAnswer } from "../../features/practice/hooks/useEvaluateAnswer";
import { QuestionCard } from "../../features/practice/components/QuestionCard";
import { EvaluationDashboard } from "../../features/practice/components/EvaluationDashboard";
import { Loader2, AlertCircle, Lightbulb, SkipForward, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { QuestionSkeleton } from "@/components/shared/LoadingSkeleton";
import * as motion from "framer-motion/client";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (!evaluationResult && questionData && startTime > 0) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, evaluationResult, questionData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const generateQuestion = useGenerateQuestion();
  const skipQuestion = useSkipQuestion();
  const getHint = useQuestionHint();
  const getExplanation = useQuestionExplanation();
  const evaluateAnswer = useEvaluateAnswer();

  if (!sessionId || !taskId) {
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
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
    );
  }

  const handleNextQuestion = () => {
    setHint(null);
    setExplanation(null);
    setSelectedOption(null);
    setTextAnswer("");
    setQuestionData(null);
    setEvaluationResult(null);

    generateQuestion.mutate({ sessionId, taskId }, {
      onSuccess: (data) => {
        setCurrentAttemptId(data.attemptId);
        setQuestionData({ ...data.question, topicId: data.topicId });
        setStartTime(Date.now());
        setElapsedTime(0);
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

  const handleSubmit = () => {
    if (!currentAttemptId || !questionData) return;
    const currentAnswer = questionData.options ? selectedOption : textAnswer;
    if (!currentAnswer) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    evaluateAnswer.mutate({
      questionId: currentAttemptId,
      studyTaskId: taskId,
      studySessionId: sessionId,
      roadmapTopicId: questionData.topicId || taskId,
      question: questionData.question,
      questionType: questionData.type,
      difficulty: questionData.difficulty,
      userAnswer: currentAnswer,
      timeTaken
    }, {
      onSuccess: (data) => {
        setEvaluationResult(data);
      }
    });
  };

  // Initial load state
  if (!questionData && !generateQuestion.isPending) {
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
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
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {generateQuestion.isPending ? (
        <QuestionSkeleton />
      ) : evaluationResult ? (
        <EvaluationDashboard
          evaluation={evaluationResult}
          onNextQuestion={handleNextQuestion}
        />
      ) : questionData ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <QuestionCard
            question={questionData.question}
            type={questionData.type}
            difficulty={questionData.difficulty}
            codeSnippet={questionData.codeSnippet}
            options={questionData.options}
            selectedOption={selectedOption}
            onOptionSelect={setSelectedOption}
          />

          {/* Text answer area */}
          {!questionData.options && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[var(--fg-primary)]">Your Answer</h3>
                <span className="stat-number text-xs bg-[var(--bg-sunken)] px-2 py-1 rounded-md text-[var(--fg-muted)]">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <textarea
                className="w-full answer-area"
                placeholder="Type your answer or code here..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
              <div className="text-right text-xs text-[var(--fg-muted)] mt-2 font-mono">
                {textAnswer.length} characters
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleGetHint}
                disabled={getHint.isPending}
                className="btn-ghost px-4 py-2 text-xs flex-1 sm:flex-none"
              >
                {getHint.isPending ? (
                  <span className="h-3.5 w-3.5 mr-1.5 rounded-full border-2 border-[var(--fg-muted)] border-t-[var(--fg-primary)] animate-spin" />
                ) : (
                  <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                )}
                Get Hint
              </button>
              <button
                onClick={handleGetExplanation}
                disabled={getExplanation.isPending}
                className="btn-ghost px-4 py-2 text-xs flex-1 sm:flex-none"
              >
                {getExplanation.isPending ? (
                  <span className="h-3.5 w-3.5 mr-1.5 rounded-full border-2 border-[var(--fg-muted)] border-t-[var(--fg-primary)] animate-spin" />
                ) : (
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                )}
                Explain Concept
              </button>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleSkip}
                disabled={skipQuestion.isPending || evaluateAnswer.isPending}
                className="btn-ghost px-5 py-2.5 text-sm flex-1 sm:flex-none"
              >
                <SkipForward className="h-3.5 w-3.5 mr-1.5" />
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={evaluateAnswer.isPending || (!selectedOption && !textAnswer.trim())}
                className="btn-primary px-6 py-2.5 text-sm flex-1 sm:flex-none"
              >
                {evaluateAnswer.isPending ? (
                  <>
                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </div>
          </div>

          {/* Hint / Explanation Reveal */}
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
              style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            >
              <div className="flex items-center gap-2 mb-3 font-semibold" style={{ color: "var(--accent)" }}>
                <Lightbulb className="h-4 w-4" />
                <h3>AI Hint</h3>
              </div>
              <div className="prose-careeros text-sm">
                <ReactMarkdown>{hint}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center gap-2 mb-3 font-semibold text-[var(--fg-primary)]">
                <BookOpen className="h-4 w-4" />
                <h3>Conceptual Explanation</h3>
              </div>
              <div className="prose-careeros text-sm">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      ) : null}
    </div>
  );
}
