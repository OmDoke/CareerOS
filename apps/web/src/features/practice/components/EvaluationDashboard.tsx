import React from "react";
import { CircularProgress } from "../../../components/ui/circular-progress";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import * as motion from "framer-motion/client";

interface EvaluationDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluation: any;
  onNextQuestion: () => void;
}

/* Score colour based on value */
function scoreColor(score: number) {
  if (score >= 80) return "var(--ok)";
  if (score >= 60) return "var(--accent)";
  return "var(--err)";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Exceeds bar";
  if (score >= 60) return "Meets bar";
  return "Needs work";
}

export function EvaluationDashboard({ evaluation, onNextQuestion }: EvaluationDashboardProps) {
  if (!evaluation) return null;

  const color = scoreColor(evaluation.overallScore);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
      >
        <div>
          <p className="eyebrow text-[var(--fg-muted)] mb-1">Result</p>
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] tracking-tight">
            Performance Breakdown
          </h2>
          <p className="text-xs text-[var(--fg-secondary)] mt-0.5">
            AI analysis of your answer across 6 dimensions.
          </p>
        </div>
        <button onClick={onNextQuestion} className="btn-primary px-6 py-2.5 text-sm shrink-0">
          Next question
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      {/* ── Score reveal — the dramatic moment ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Large score circle */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div style={{ color }}>
              <CircularProgress
                value={evaluation.overallScore}
                size={120}
                strokeWidth={9}
                label="Overall"
                strokeClassName=""
              />
            </div>
            <span
              className="badge text-xs font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
                color,
              }}
            >
              {scoreLabel(evaluation.overallScore)}
            </span>
          </div>

          {/* Dimension breakdown */}
          <div className="flex-1 w-full">
            <p className="eyebrow text-[var(--fg-muted)] mb-4">By dimension</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { label: "Technical", value: evaluation.technicalScore },
                { label: "Problem Solving", value: evaluation.problemSolvingScore },
                { label: "Communication", value: evaluation.communicationScore },
                { label: "Time Complexity", value: evaluation.timeComplexityScore },
                { label: "Space Complexity", value: evaluation.spaceComplexityScore },
                { label: "Confidence", value: evaluation.confidenceScore },
              ]
                .filter((d) => d.value !== undefined)
                .map((dim) => (
                  <div key={dim.label} className="text-center" style={{ color: scoreColor(dim.value || 0) }}>
                    <CircularProgress
                      value={dim.value || 0}
                      size={72}
                      strokeWidth={5}
                      fontSize="text-sm"
                      strokeClassName=""
                    />
                    <p className="text-xs text-[var(--fg-secondary)] mt-1.5 font-medium">{dim.label}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Strengths + Mistakes ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        {/* Strengths */}
        <div
          className="card p-5"
          style={{ borderColor: "color-mix(in srgb, var(--ok) 30%, transparent)" }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3"
            style={{ color: "var(--ok)" }}>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {(evaluation.strengths || []).map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "var(--ok)" }} />
                <span className="text-xs text-[var(--fg-secondary)] leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to improve */}
        <div
          className="card p-5"
          style={{ borderColor: "color-mix(in srgb, var(--err) 30%, transparent)" }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3"
            style={{ color: "var(--err)" }}>
            <XCircle className="h-4 w-4 shrink-0" />
            Areas to improve
          </h3>
          <ul className="space-y-2">
            {(evaluation.mistakes || []).map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <X className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "var(--err)" }} />
                <span className="text-xs text-[var(--fg-secondary)] leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── Missing concepts ── */}
      {evaluation.missingConcepts && evaluation.missingConcepts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="card p-5"
          style={{ borderColor: "color-mix(in srgb, var(--warn) 30%, transparent)" }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3"
            style={{ color: "var(--warn)" }}>
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Concepts to review
          </h3>
          <ul className="flex flex-wrap gap-2">
            {evaluation.missingConcepts.map((s: string, i: number) => (
              <li key={i}>
                <span
                  className="badge text-xs"
                  style={{
                    backgroundColor: "var(--accent-dim)",
                    borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
                    color: "var(--accent-hover)",
                  }}
                >
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── AI Feedback ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-primary)] mb-4">
          <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
          AI Feedback
        </h3>
        <div className="prose-careeros text-sm">
          <ReactMarkdown>{evaluation.feedback}</ReactMarkdown>
        </div>
      </motion.div>

      {/* ── Model answers ── */}
      {(evaluation.correctAnswer || evaluation.optimizedAnswer) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {evaluation.correctAnswer && (
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-primary)] mb-3">
                <CheckCircle2 className="h-4 w-4 text-[var(--ok)]" />
                Model answer
              </h3>
              <div className="prose-careeros text-xs max-h-80 overflow-y-auto">
                <ReactMarkdown>{evaluation.correctAnswer}</ReactMarkdown>
              </div>
            </div>
          )}
          {evaluation.optimizedAnswer && (
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-primary)] mb-3">
                <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
                Optimized approach
              </h3>
              <div className="prose-careeros text-xs max-h-80 overflow-y-auto">
                <ReactMarkdown>{evaluation.optimizedAnswer}</ReactMarkdown>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Resources ── */}
      {evaluation.resources && evaluation.resources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card p-5"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-primary)] mb-3">
            <BookOpen className="h-4 w-4 text-[var(--ok)]" />
            Recommended reading
          </h3>
          <ul className="space-y-1.5">
            {evaluation.resources.map((r: string, i: number) => (
              <li key={i} className="text-xs text-[var(--fg-secondary)] flex items-start gap-2">
                <span className="text-[var(--fg-muted)] shrink-0 mt-0.5">›</span>
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
