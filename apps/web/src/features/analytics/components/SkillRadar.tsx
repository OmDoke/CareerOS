"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SkillRadar({ stats }: { stats: any }) {
  const data = [
    { subject: 'Coding',      A: stats?.codingAccuracy || 0,  fullMark: 100 },
    { subject: 'Theory',      A: stats?.theoryAccuracy || 0,  fullMark: 100 },
    { subject: 'Problem Solving', A: stats?.averageScore || 0, fullMark: 100 },
    { subject: 'Communication',   A: stats?.averageScore || 0, fullMark: 100 },
    { subject: 'Time Complexity', A: stats?.averageScore || 0, fullMark: 100 },
    { subject: 'Space Complexity',A: stats?.averageScore || 0, fullMark: 100 },
  ];

  return (
    <div className="card p-5 h-full">
      <div className="mb-3">
        <p className="eyebrow text-[var(--fg-muted)] mb-1">Skill radar</p>
        <h3 className="text-sm font-semibold text-[var(--fg-primary)]">Proficiency across dimensions</h3>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke="var(--border)" strokeWidth={1} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'var(--fg-muted)', fontSize: 10, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--fg-primary)',
                boxShadow: 'var(--shadow-md)',
                fontSize: '12px',
              }}
            />
            <Radar
              name="Proficiency"
              dataKey="A"
              stroke="#D97706"
              strokeWidth={1.5}
              fill="#D97706"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
