"use client";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { useRoadmap, useGenerateRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { RoadmapHeader } from "../../features/roadmap/components/RoadmapHeader";
import { ModuleCard } from "../../features/roadmap/components/ModuleCard";
import { ProgressBar } from "../../features/roadmap/components/ProgressBar";
import { Route, Map, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import * as motion from "framer-motion/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    return (
      <ProtectedLayout>
        <SpinnerSkeleton />
      </ProtectedLayout>
    );
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
      <ProtectedLayout>
        <div className="animate-in fade-in duration-500">
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
              <div className="mt-8 w-full max-w-md mx-auto space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Role</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Senior React Developer" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      disabled={generateRoadmap.isPending}
                    />
                    <Button 
                      onClick={() => handleGenerate()} 
                      disabled={!role.trim() || generateRoadmap.isPending}
                      className="shrink-0"
                    >
                      {generateRoadmap.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                      )}
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Popular suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setRole(s);
                          handleGenerate(s);
                        }}
                        disabled={generateRoadmap.isPending}
                        className="text-xs px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full border transition-colors disabled:opacity-50"
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
      </ProtectedLayout>
    );
  }

  const totalTopics = roadmap.modules.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0);
  const completedTopics = roadmap.modules.reduce((acc: number, m: any) => 
    acc + (m.topics?.filter((t: any) => t.status === "COMPLETED").length || 0)
  , 0);

  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <ProtectedLayout>
      <div className="animate-in fade-in duration-500">
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

        <div className="mb-8 p-6 border rounded-2xl bg-card shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span>Overall Progress</span>
              <span className="text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <ProgressBar progress={progressPercentage} className="h-3" />
          </div>
          <Link href="/today" className="w-full sm:w-auto shrink-0">
            <Button size="lg" className="w-full sm:w-auto shadow-sm">
              Continue Learning
              <Route className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
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
    </ProtectedLayout>
  );
}
