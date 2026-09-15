import React from "react";
import { CircularProgress } from "../../../components/ui/circular-progress";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, Lightbulb, ChevronRight, Check, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface EvaluationDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluation: any;
  onNextQuestion: () => void;
}

export function EvaluationDashboard({ evaluation, onNextQuestion }: EvaluationDashboardProps) {
  if (!evaluation) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Evaluation Results</h2>
          <p className="text-muted-foreground">Here is how you did on your recent answer.</p>
        </div>
        <Button size="lg" onClick={onNextQuestion} className="w-full md:w-auto">
          Next Question <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
          <CircularProgress value={evaluation.overallScore} size={100} label="Overall" />
        </Card>
        <Card className="col-span-2 md:col-span-3 p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <CircularProgress value={evaluation.technicalScore || 0} size={80} strokeWidth={6} label="Technical" />
            <CircularProgress value={evaluation.problemSolvingScore || 0} size={80} strokeWidth={6} label="Problem Solving" />
            <CircularProgress value={evaluation.communicationScore || 0} size={80} strokeWidth={6} label="Communication" />
            {(evaluation.timeComplexityScore !== undefined || evaluation.spaceComplexityScore !== undefined) && (
              <>
                <CircularProgress value={evaluation.timeComplexityScore || 0} size={80} strokeWidth={6} label="Time Complexity" />
                <CircularProgress value={evaluation.spaceComplexityScore || 0} size={80} strokeWidth={6} label="Space Complexity" />
              </>
            )}
            <CircularProgress value={evaluation.confidenceScore || 0} size={80} strokeWidth={6} label="Confidence" />
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600 dark:text-green-500">
              <CheckCircle2 className="h-5 w-5 mr-2" /> What You Did Well
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(evaluation.strengths || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                  <span className="text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600 dark:text-red-500">
              <XCircle className="h-5 w-5 mr-2" /> Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(evaluation.mistakes || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start">
                  <X className="h-4 w-4 text-red-500 mr-2 mt-1 shrink-0" />
                  <span className="text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {evaluation.missingConcepts && evaluation.missingConcepts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-amber-600 dark:text-amber-500">
              <AlertTriangle className="h-5 w-5 mr-2" /> Missing Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {evaluation.missingConcepts.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Comprehensive Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{evaluation.feedback}</ReactMarkdown>
        </CardContent>
      </Card>

      {(evaluation.correctAnswer || evaluation.optimizedAnswer) && (
        <div className="grid md:grid-cols-2 gap-6">
          {evaluation.correctAnswer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> Ideal Answer / Correct Code
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto">
                <ReactMarkdown>{evaluation.correctAnswer}</ReactMarkdown>
              </CardContent>
            </Card>
          )}
          
          {evaluation.optimizedAnswer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-500" /> Optimized Version
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto">
                <ReactMarkdown>{evaluation.optimizedAnswer}</ReactMarkdown>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {evaluation.resources && evaluation.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
              <BookOpen className="h-5 w-5 mr-2" /> Recommended Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {evaluation.resources.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
