"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { useProgressAnalytics, useDashboardAnalytics } from "../../features/analytics/hooks/useAnalytics";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatCard } from "@/components/shared/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, Target, Flame, BrainCircuit, Clock } from "lucide-react";
import { SkillRadar } from "../../features/analytics/components/SkillRadar";
import * as motion from "framer-motion/client";

export default function ProgressPage() {
  const { data: progress, isLoading: isProgressLoading } = useProgressAnalytics();
  const { data: stats, isLoading: isStatsLoading } = useDashboardAnalytics();

  if (isProgressLoading || isStatsLoading) {
    return <SpinnerSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Learning Progress"
        description="Detailed analytics and mastery tracking"
        breadcrumbItems={[{ label: "Progress" }]}
      />

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger">
        <StatCard
          title="Questions Answered"
          value={stats?.practiceQuestions || 0}
          icon={BrainCircuit}
          accentColor="accent"
        />
        <StatCard
          title="Average Score"
          value={`${Math.round(stats?.averageScore || 0)}%`}
          icon={Target}
          accentColor="ok"
        />
        <StatCard
          title="Longest Streak"
          value={stats?.longestStreak || 0}
          description="days"
          icon={Flame}
          accentColor="err"
        />
        <StatCard
          title="Total Study Time"
          value={Math.round((progress?.totalStudyTime || 0) / 60)}
          description="mins"
          icon={Clock}
          accentColor="muted"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)]">Weekly Activity</h3>
            <p className="text-xs text-[var(--fg-secondary)] mt-1">Questions answered over the last 7 days</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress?.weeklyProgress || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                  tick={{ fill: 'var(--fg-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: 'var(--fg-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <RechartsTooltip
                  cursor={{ fill: 'var(--bg-sunken)' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--fg-primary)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
                <Bar dataKey="questionsAnswered" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)]">Score Progression</h3>
            <p className="text-xs text-[var(--fg-secondary)] mt-1">Average scores over the last 7 days</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress?.weeklyProgress || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                  tick={{ fill: 'var(--fg-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--fg-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--fg-primary)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: 'var(--ok)' }}
                />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="var(--ok)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--ok)', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: 'var(--ok)', stroke: 'var(--bg-surface)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <SkillRadar stats={stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="card p-6 lg:col-span-2 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4 h-16 w-16 rounded-2xl bg-[var(--bg-sunken)] flex items-center justify-center">
            <Trophy className="h-8 w-8 text-[var(--fg-muted)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--fg-primary)]">Leaderboard Statistics</h3>
          <p className="text-sm text-[var(--fg-secondary)] mt-1 max-w-sm">
            Keep studying to unlock advanced percentile rankings!
          </p>
          <p className="text-xs text-[var(--fg-muted)] mt-4">
            Currently ranked in top 30% of users targeting similar roles.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
