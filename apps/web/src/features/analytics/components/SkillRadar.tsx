"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SkillRadar({ stats }: { stats: any }) {
  // Translate our stats into radar data
  const data = [
    {
      subject: 'Coding',
      A: stats?.codingAccuracy || 0,
      fullMark: 100,
    },
    {
      subject: 'Theory',
      A: stats?.theoryAccuracy || 0,
      fullMark: 100,
    },
    {
      subject: 'Problem Solving',
      A: stats?.averageScore || 0, // Fallback if we don't track problem solving explicitly here
      fullMark: 100,
    },
    {
      subject: 'Communication',
      A: stats?.averageScore || 0,
      fullMark: 100,
    },
    {
      subject: 'Time Complexity',
      A: stats?.averageScore || 0,
      fullMark: 100,
    },
    {
      subject: 'Space Complexity',
      A: stats?.averageScore || 0,
      fullMark: 100,
    },
  ];

  return (
    <div className="h-full rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis</p>
        <h3 className="text-lg font-bold text-slate-900 mt-1">Skill Proficiency Radar</h3>
        <p className="text-xs text-slate-500 mt-0.5">Your proficiency across interview evaluation dimensions</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(16px)',
                color: '#0f172a',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)'
              }} 
            />
            <Radar
              name="Proficiency"
              dataKey="A"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="#7c3aed"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
