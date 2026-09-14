"use client";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { useRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { GenerateRoadmapButton } from "../../features/roadmap/components/GenerateRoadmapButton";
import { RoadmapHeader } from "../../features/roadmap/components/RoadmapHeader";
import { ModuleCard } from "../../features/roadmap/components/ModuleCard";
import { ProgressBar } from "../../features/roadmap/components/ProgressBar";
import { Loader2, Route } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const { data: roadmap, isLoading, error } = useRoadmap();

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Learning Roadmap...</p>
        </div>
      </ProtectedLayout>
    );
  }

  // Handle case where user hasn't generated a roadmap yet
  if (error || !roadmap) {
    return (
      <ProtectedLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center text-center p-12 border rounded-xl bg-card">
            <Route className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Learning Roadmap Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Generate a personalized learning roadmap based on your AI Resume Analysis to start preparing for your interviews.
            </p>
            <div className="flex flex-col items-center gap-4">
              <GenerateRoadmapButton />
              <div className="text-sm text-muted-foreground mt-4">
                Haven&apos;t uploaded a resume yet? <Link href="/resume" className="text-primary hover:underline">Go to Resume</Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  // Calculate global progress
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalTopics = roadmap.modules.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedTopics = roadmap.modules.reduce((acc: number, m: any) => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc + (m.topics?.filter((t: any) => t.status === "COMPLETED").length || 0)
  , 0);

  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <ProtectedLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        
        <RoadmapHeader 
          title={roadmap.title}
          targetRole={roadmap.targetRole}
          currentLevel={roadmap.currentLevel}
          estimatedWeeks={roadmap.estimatedWeeks}
        />

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <ProgressBar progress={progressPercentage} className="h-3" />
        </div>

        <div className="space-y-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {roadmap.modules.map((mod: any, index: number) => (
            <ModuleCard key={mod.id || index} module={mod} index={index} />
          ))}
        </div>
        
      </div>
    </ProtectedLayout>
  );
}
