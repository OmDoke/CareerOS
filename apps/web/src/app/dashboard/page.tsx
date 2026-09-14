"use client";

import { useAuthStore } from "../../store/auth.store";
import { useResume } from "../../features/resume/hooks/useResume";
import { useTodaySession } from "../../features/study-session/hooks/useStudySession";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import Link from "next/link";
import { 
  FileText, 
  Map, 
  CalendarDays, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: resume, isLoading: isLoadingResume } = useResume();
  const { data: todaySession, isLoading: isLoadingSession } = useTodaySession();

  // Mocking Roadmap status for now since useRoadmap might need a specific import
  const hasRoadmap = !!user?.currentRoadmapId;

  const getResumeStatus = () => {
    if (!resume) return { text: "No resume uploaded", color: "text-muted-foreground", icon: AlertCircle };
    if (resume.status === "ANALYZED") return { text: "Analyzed & Ready", color: "text-green-500", icon: CheckCircle2 };
    return { text: "Pending Analysis", color: "text-yellow-500", icon: AlertCircle };
  };

  const resumeStatus = getResumeStatus();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.firstName || user?.email}! Here's your career preparation overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Resume Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <resumeStatus.icon className={`h-5 w-5 ${resumeStatus.color}`} />
              <span className="text-lg">{resumeStatus.text}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {resume ? "Used for AI curriculum generation." : "Upload to start your journey."}
            </p>
            <div className="mt-4">
              <Link href={resume ? "/resume/analysis" : "/resume"}>
                <Button variant="outline" size="sm" className="w-full">
                  {resume ? "View Analysis" : "Upload Resume"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Curriculum Roadmap</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {hasRoadmap ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-lg">Generated</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg">Not Generated</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {hasRoadmap ? "Your personalized learning path." : "Requires resume analysis first."}
            </p>
            <div className="mt-4">
              <Link href="/roadmap">
                <Button variant="outline" size="sm" className="w-full" disabled={!resume && !hasRoadmap}>
                  {hasRoadmap ? "View Roadmap" : "Generate Roadmap"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Today's Session Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Session</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaySession ? (
                <span className="text-lg">{todaySession.status === "COMPLETED" ? "Completed!" : "In Progress"}</span>
              ) : (
                <span className="text-lg text-muted-foreground">Not Started</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {todaySession 
                ? `${todaySession.tasks?.filter((t: any) => t.status === "COMPLETED").length || 0}/${todaySession.tasks?.length || 0} tasks completed` 
                : "Daily ~60 min study plan."}
            </p>
            <div className="mt-4">
              <Link href="/today">
                <Button variant="default" size="sm" className="w-full" disabled={!hasRoadmap}>
                  {todaySession ? "Continue Session" : "Start Session"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest milestones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">Logged In</p>
                  <p className="text-sm text-muted-foreground mt-1">Just now</p>
                </div>
              </div>
              {resume && (
                <div className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium leading-none">Resume Updated</p>
                    <p className="text-sm text-muted-foreground mt-1">Recently</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Your journey to interview readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Roadmap Completion</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Practice Mastery</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
