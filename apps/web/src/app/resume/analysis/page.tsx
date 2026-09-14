"use client";

import { ProtectedLayout } from "../../../layouts/ProtectedLayout";
import { useAiAnalysis } from "../../../features/resume/hooks/useAiAnalysis";
import { AnalyzeResumeButton } from "../../../features/resume/components/AnalyzeResumeButton";
import { 
  ResumeSummaryCard, 
  StrengthsCard, 
  WeaknessesCard, 
  SuggestedSkillsCard 
} from "../../../features/resume/components/AiInsightCards";
import { 
  SkillsCard, 
  ExperienceCard, 
  EducationCard, 
  ProjectsCard 
} from "../../../features/resume/components/DataCards";
import { Bot, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import * as motion from "framer-motion/client";

export default function AiAnalysisPage() {
  const { data: resume, isLoading, error } = useAiAnalysis();

  if (isLoading) {
    return (
      <ProtectedLayout>
        <SpinnerSkeleton />
      </ProtectedLayout>
    );
  }

  if (error || !resume || resume.status !== "ANALYZED") {
    const hasResume = !!resume;
    const notUploaded = !hasResume;

    return (
      <ProtectedLayout>
        <div className="animate-in fade-in duration-500">
          <PageHeader 
            title="AI Resume Analysis"
            description="Extract deep insights to power your custom study curriculum."
            breadcrumbItems={[
              { label: "Resume", href: "/resume" },
              { label: "Analysis" }
            ]}
          />
          <div className="max-w-2xl mx-auto mt-12">
            <EmptyState
              icon={Bot}
              title={notUploaded ? "No Resume Found" : "Resume Not Analyzed"}
              description={notUploaded
                ? "Upload your resume first, then run the AI analysis to unlock personalized insights."
                : "Click below to extract structured data and get personalized insights from your resume."}
              primaryAction={notUploaded ? {
                label: "Go to Resume",
                href: "/resume"
              } : undefined}
            >
              {!notUploaded && (
                <div className="mt-6 flex justify-center w-full">
                  <AnalyzeResumeButton />
                </div>
              )}
            </EmptyState>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  const safeParseJSON = (data: string | undefined | null, fallback: any = []) => {
    if (!data) return fallback;
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return fallback;
    }
  };

  const strengths = safeParseJSON(resume.strengths);
  const weaknesses = safeParseJSON(resume.weaknesses);
  const suggestedSkills = safeParseJSON(resume.suggestedSkills);

  // Derive a fake score based on length of strengths vs weaknesses
  const score = Math.min(99, Math.max(40, 70 + (strengths.length * 5) - (weaknesses.length * 5)));

  return (
    <ProtectedLayout>
      <div className="animate-in fade-in duration-500">
        <PageHeader 
          title="AI Resume Analysis"
          description="Deep insights and structured extraction powered by Gemini."
          breadcrumbItems={[
            { label: "Resume", href: "/resume" },
            { label: "Analysis" }
          ]}
          showBackButton={true}
          action={
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full font-bold">
                <Zap className="h-4 w-4" />
                Score: {score}/100
              </div>
              <AnalyzeResumeButton force={true} />
            </div>
          }
        />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ResumeSummaryCard summary={resume.aiSummary} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StrengthsCard strengths={strengths} />
            <WeaknessesCard weaknesses={weaknesses} />
            <SuggestedSkillsCard skills={suggestedSkills} />
          </div>

          <div className="pt-8 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Structured Data</h2>
            <p className="text-muted-foreground mt-1 text-sm">Data extracted accurately from your resume.</p>
          </div>
          
          <div className="space-y-6">
            <SkillsCard data={resume.skills} />
            <ExperienceCard data={resume.experience} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EducationCard data={resume.education} />
              <ProjectsCard data={resume.projects} />
            </div>
          </div>

          {/* Sticky Bottom CTA */}
          <div className="sticky bottom-4 md:bottom-8 mt-12 z-40">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border rounded-2xl bg-card/90 backdrop-blur-md shadow-xl gap-4">
              <div>
                <h3 className="font-bold text-lg">Ready for the next step?</h3>
                <p className="text-sm text-muted-foreground">Generate a custom learning curriculum based on these insights.</p>
              </div>
              <div className="flex w-full sm:w-auto gap-4">
                <Link href="/dashboard" className="hidden sm:block">
                  <Button variant="outline" size="lg">Dashboard</Button>
                </Link>
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full shadow-md bg-primary hover:bg-primary/90">
                    Generate Roadmap
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedLayout>
  );
}
