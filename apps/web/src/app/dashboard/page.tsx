"use client";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";
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
  AlertCircle,
  Dumbbell,
  Trophy,
  Flame,
  Star,
  BrainCircuit,
  Target
} from "lucide-react";
import * as motion from "framer-motion/client";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: resume, isLoading: isLoadingResume } = useResume();
  const { data: todaySession, isLoading: isLoadingSession } = useTodaySession();

  const hasRoadmap = !!user?.currentRoadmapId;

  if (isLoadingResume || isLoadingSession) {
    return (
      <ProtectedLayout>
        <SpinnerSkeleton />
      </ProtectedLayout>
    );
  }

  const steps = [
    { id: 1, name: "Upload Resume", status: resume ? "complete" : "current", icon: FileText, href: "/resume" },
    { id: 2, name: "AI Analysis", status: resume?.status === "ANALYZED" ? "complete" : resume ? "current" : "upcoming", icon: BrainCircuit, href: "/resume/analysis" },
    { id: 3, name: "Generate Roadmap", status: hasRoadmap ? "complete" : resume?.status === "ANALYZED" ? "current" : "upcoming", icon: Map, href: "/roadmap" },
    { id: 4, name: "Today's Study", status: todaySession?.status === "COMPLETED" ? "complete" : hasRoadmap ? "current" : "upcoming", icon: CalendarDays, href: "/today" },
    { id: 5, name: "Practice", status: "upcoming", icon: Dumbbell, href: "/practice" },
    { id: 6, name: "Interview Readiness", status: "upcoming", icon: Target, href: "#" },
  ];

  return (
    <ProtectedLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <PageHeader 
          title={`Welcome back, ${user?.firstName || user?.email?.split('@')[0] || "User"}!`}
          description="Here is your career preparation overview."
          action={
            <div className="hidden sm:flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-full border shadow-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="font-bold text-sm">Lvl 1</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold text-sm">0 XP</span>
              </div>
            </div>
          }
        />

        {/* 6-step Guided User Flow */}
        <Card className="border-none shadow-md bg-gradient-to-br from-card to-secondary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <CardHeader>
            <CardTitle>Your Journey</CardTitle>
            <CardDescription>Follow these steps to master your next interview.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6 md:gap-0 mt-4">
              <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 z-0" />
              
              {steps.map((step, idx) => (
                <motion.div 
                  key={step.id} 
                  className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={step.status !== "upcoming" ? step.href : "#"} className="flex md:flex-col items-center gap-4 md:gap-2 w-full">
                    <div className={`
                      h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                      ${step.status === 'complete' ? 'bg-success text-success-foreground border-success' : 
                        step.status === 'current' ? 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/20' : 
                        'bg-card text-muted-foreground border-border group-hover:border-primary/50'}
                    `}>
                      {step.status === 'complete' ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                    </div>
                    <div className="text-left md:text-center">
                      <p className={`text-sm font-semibold ${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">{step.status === 'current' ? 'Next step' : step.status === 'complete' ? 'Done' : 'Locked'}</p>
                    </div>
                  </Link>
                  {idx !== steps.length - 1 && (
                    <div className={`md:hidden absolute left-6 top-12 bottom-[-1.5rem] w-0.5 ${step.status === 'complete' ? 'bg-success' : 'bg-border'}`} />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Current Streak" 
            value="3 Days" 
            icon={Flame} 
            trend={{ value: 100, label: "from last week", positive: true }} 
            delay={0.1}
          />
          <StatCard 
            title="Skills Mastered" 
            value="0" 
            icon={Target} 
            description="Ready for interviews" 
            delay={0.2}
          />
          <StatCard 
            title="Practice Questions" 
            value="0" 
            icon={Dumbbell} 
            description="Answered correctly" 
            delay={0.3}
          />
          <StatCard 
            title="Average Score" 
            value="0%" 
            icon={BrainCircuit} 
            description="Across all topics" 
            delay={0.4}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Today's Session Card */}
          <Card className="lg:col-span-2 border-primary/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Today's Focus</CardTitle>
                <CardDescription>Your recommended tasks for the day.</CardDescription>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {todaySession ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold">{todaySession.status === "COMPLETED" ? "Session Completed! 🎉" : "In Progress"}</p>
                      <p className="text-sm text-muted-foreground mt-1">Keep up the great work.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">60 mins</p>
                      <p className="text-xs text-muted-foreground">Estimated</p>
                    </div>
                  </div>
                  <Progress value={todaySession.status === "COMPLETED" ? 100 : 33} className="h-3" />
                  <div className="pt-4 flex gap-3">
                    <Link href="/today" className="flex-1">
                      <Button className="w-full" size="lg">
                        {todaySession.status === "COMPLETED" ? "Review Session" : "Continue Session"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">No Active Session</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                    {hasRoadmap 
                      ? "Generate today's personalized study session to continue."
                      : "You need to generate a roadmap before starting a session."}
                  </p>
                  <Link href={hasRoadmap ? "/today" : "/roadmap"}>
                    <Button size="lg" disabled={!resume}>
                      {hasRoadmap ? "Start Today's Session" : "Go to Roadmap"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">Account created</span>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Welcome to CareerOS!</p>
                  </div>
                </div>
                
                {resume && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">Resume Uploaded</span>
                        <span className="text-xs text-muted-foreground">Today</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
