import React from "react";
import { CircularProgress } from "../../../components/ui/circular-progress";
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, Lightbulb, ChevronRight, Check, X, Sparkles } from "lucide-react";
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
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full w-fit mb-2">
            <Sparkles className="h-3 w-3" />
            Evaluation Complete
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Performance Breakdown</h2>
          <p className="text-xs text-slate-500 mt-1">Algorithmic analysis of your interview answer.</p>
        </div>
        <button 
          onClick={onNextQuestion} 
          className="w-full md:w-auto rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] px-8 py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          Next Question <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="col-span-2 md:col-span-1 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col items-center justify-center text-center">
          <CircularProgress value={evaluation.overallScore} size={110} label="Overall Score" />
          <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {evaluation.overallScore >= 80 ? "Exceeds Bar" : evaluation.overallScore >= 60 ? "Meets Bar" : "Needs Review"}
          </span>
        </div>
        <div className="col-span-2 md:col-span-3 rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Dimensions</p>
          <h3 className="text-lg font-bold text-slate-900 mb-6">Detailed Competency Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <CircularProgress value={evaluation.technicalScore || 0} size={76} strokeWidth={6} label="Technical" />
            <CircularProgress value={evaluation.problemSolvingScore || 0} size={76} strokeWidth={6} label="Problem Solving" />
            <CircularProgress value={evaluation.communicationScore || 0} size={76} strokeWidth={6} label="Communication" />
            {(evaluation.timeComplexityScore !== undefined || evaluation.spaceComplexityScore !== undefined) && (
              <>
                <CircularProgress value={evaluation.timeComplexityScore || 0} size={76} strokeWidth={6} label="Time Complexity" />
                <CircularProgress value={evaluation.spaceComplexityScore || 0} size={76} strokeWidth={6} label="Space Complexity" />
              </>
            )}
            <CircularProgress value={evaluation.confidenceScore || 0} size={76} strokeWidth={6} label="Confidence" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/40 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
          <h3 className="flex items-center text-emerald-800 font-bold text-base mb-4">
            <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-600 shrink-0" /> Strengths Identified
          </h3>
          <ul className="space-y-3">
            {(evaluation.strengths || []).map((s: string, i: number) => (
              <li key={i} className="flex items-start">
                <Check className="h-4 w-4 text-emerald-600 mr-2.5 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/40 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
          <h3 className="flex items-center text-rose-800 font-bold text-base mb-4">
            <XCircle className="h-5 w-5 mr-2 text-rose-600 shrink-0" /> Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {(evaluation.mistakes || []).map((s: string, i: number) => (
              <li key={i} className="flex items-start">
                <X className="h-4 w-4 text-rose-600 mr-2.5 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {evaluation.missingConcepts && evaluation.missingConcepts.length > 0 && (
        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/40 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
          <h3 className="flex items-center text-amber-800 font-bold text-base mb-4">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" /> Missing Concepts to Review
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
            {evaluation.missingConcepts.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
        <h3 className="flex items-center text-slate-900 font-bold text-base mb-3">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Comprehensive AI Feedback
        </h3>
        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-normal">
          <ReactMarkdown>{evaluation.feedback}</ReactMarkdown>
        </div>
      </div>

      {(evaluation.correctAnswer || evaluation.optimizedAnswer) && (
        <div className="grid md:grid-cols-2 gap-6">
          {evaluation.correctAnswer && (
            <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
              <h3 className="flex items-center text-slate-900 font-bold text-base mb-4">
                <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-600" /> Model Answer & Formulation
              </h3>
              <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto text-slate-700">
                <ReactMarkdown>{evaluation.correctAnswer}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {evaluation.optimizedAnswer && (
            <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
              <h3 className="flex items-center text-slate-900 font-bold text-base mb-4">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Optimized Architecture
              </h3>
              <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto text-slate-700">
                <ReactMarkdown>{evaluation.optimizedAnswer}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {evaluation.resources && evaluation.resources.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
          <h3 className="flex items-center text-slate-900 font-bold text-base mb-4">
            <BookOpen className="h-5 w-5 mr-2 text-teal-600" /> Recommended Study Material
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
            {evaluation.resources.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
