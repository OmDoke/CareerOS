"use client";

import { useRoadmap, useGenerateRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { RoadmapHeader } from "../../features/roadmap/components/RoadmapHeader";
import { ModuleCard } from "../../features/roadmap/components/ModuleCard";
import { ProgressBar } from "../../features/roadmap/components/ProgressBar";
import { Route, Map, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import * as motion from "framer-motion/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoadmapPage() {
  const router = useRouter();
  const { data: roadmap, isLoading, error } = useRoadmap();
  const [role, setRole] = useState("");

  const generateRoadmap = useGenerateRoadmap({
    onSuccess: () => {
      router.push("/today");
    }
  });

  if (isLoading) {
    return <SpinnerSkeleton />;
  }

  const handleGenerate = (targetRole: string = role) => {
    if (!targetRole.trim()) return;
    generateRoadmap.mutate({ targetRole: targetRole.trim() });
  };

  const suggestions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Engineer",
    "Product Manager"
  ];

  if (error || !roadmap) {
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <PageHeader
          title="Curriculum Roadmap"
          description="Your personalized path to mastering your dream role."
          breadcrumbItems={[{ label: "Roadmap" }]}
        />
        <div className="max-w-2xl mx-auto mt-12">
          <EmptyState
            icon={Map}
            title="Generate Your Roadmap"
            description="Tell us your target role, and our AI will analyze your resume to build a custom step-by-step curriculum bridging your knowledge gaps."
          >
            <div className="mt-8 w-full max-w-md mx-auto space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--fg-primary)]">Target Role</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Senior React Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    disabled={generateRoadmap.isPending}
                    className="flex-1 h-10 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-sunken)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    onClick={() => handleGenerate()}
                    disabled={!role.trim() || generateRoadmap.isPending}
                    className="btn-primary px-5 shrink-0"
                  >
                    {generateRoadmap.isPending ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-[var(--fg-muted)] mb-2 font-medium">Popular suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setRole(s);
                        handleGenerate(s);
                      }}
                      disabled={generateRoadmap.isPending}
                      className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--fg-secondary)] hover:bg-[var(--bg-sunken)] hover:text-[var(--fg-primary)] transition-colors disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </EmptyState>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalTopics = roadmap.modules.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedTopics = roadmap.modules.reduce((acc: number, m: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc + (m.topics?.filter((t: any) => t.status === "COMPLETED").length || 0)
  , 0);

  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <PageHeader
        title="Curriculum Roadmap"
        description="Your personalized learning path."
        breadcrumbItems={[{ label: "Roadmap" }]}
      />

      <RoadmapHeader
        title={roadmap.title}
        targetRole={roadmap.targetRole}
        currentLevel={roadmap.currentLevel}
        estimatedWeeks={roadmap.estimatedWeeks}
      />

      {/* Progress Card - Redesigned without glassmorphism */}
      <div className="card p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="eyebrow text-[var(--fg-muted)]">Overall Curriculum Progress</span>
            <span className="stat-number font-medium text-[var(--accent)]">{Math.round(progressPercentage)}%</span>
          </div>
          {/* We assume ProgressBar handles its own styling or uses CSS variables,
              but we wrap it here just in case. */}
          <div className="h-2 w-full rounded-full bg-[var(--bg-sunken)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <Link href="/today" className="w-full sm:w-auto shrink-0">
          <button className="btn-primary w-full sm:w-auto px-8 py-3 text-sm">
            Continue Learning
            <Route className="h-4 w-4 ml-1" />
          </button>
        </Link>
      </div>

      <div className="space-y-6 pt-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {roadmap.modules.map((mod: any, index: number) => (
          <motion.div
            key={mod.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ModuleCard module={mod} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
