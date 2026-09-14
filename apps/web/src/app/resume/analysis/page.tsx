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
import { Loader2, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

export default function AiAnalysisPage() {
  const { data: resume, isLoading, error } = useAiAnalysis();

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading AI Analysis...</p>
        </div>
      </ProtectedLayout>
    );
  }

  // Handle case where user hasn't uploaded a resume, or it's not analyzed yet
  if (error || !resume || resume.status !== "ANALYZED") {
    const hasResume = !!resume;
    const isParsed = hasResume && (resume.status === "PARSED" || resume.status === "UPLOADED");
    const notUploaded = !hasResume;

    return (
      <ProtectedLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center text-center p-12 border rounded-xl bg-card">
            <Bot className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {notUploaded ? "No Resume Found" : "Resume Not Analyzed Yet"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {notUploaded
                ? "Upload your resume first, then run the AI analysis to unlock personalized insights."
                : "Click 'Analyze with AI' to extract structured data and get personalized insights from your resume."}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/resume">
                <Button variant="outline">Go to Resume</Button>
              </Link>
              {(isParsed || hasResume) && (
                <AnalyzeResumeButton />
              )}
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <ProtectedLayout>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Resume Analysis</h1>
            <p className="text-muted-foreground mt-2">
              Deep insights and structured extraction powered by Gemini 3.6 Flash.
            </p>
          </div>
          <AnalyzeResumeButton force={true} />
        </div>

        <ResumeSummaryCard summary={resume.aiSummary} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StrengthsCard strengths={strengths} />
          <WeaknessesCard weaknesses={weaknesses} />
          <SuggestedSkillsCard skills={suggestedSkills} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-6 mt-12">Structured Data</h2>
        
        <div className="space-y-6">
          <SkillsCard data={resume.skills} />
          <ExperienceCard data={resume.experience} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EducationCard data={resume.education} />
            <ProjectsCard data={resume.projects} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center p-8 border rounded-xl bg-card gap-4 text-center">
          <h2 className="text-xl font-bold">Analysis Complete</h2>
          <p className="text-muted-foreground max-w-md">
            Your resume has been processed. The next step is to generate a custom curriculum based on these insights.
          </p>
          <div className="flex gap-4 flex-wrap justify-center mt-4">
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/roadmap">
              <Button variant="default">Generate Roadmap</Button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
