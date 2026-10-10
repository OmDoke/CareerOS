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
    <div className="h-full rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)]">
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis</p>
        <h3 className="text-lg font-bold text-white mt-1">Skill Proficiency Radar</h3>
        <p className="text-xs text-slate-400 mt-0.5">Your proficiency across interview evaluation dimensions</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255, 255, 255, 0.65)', fontSize: 11, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.15)', 
                backgroundColor: 'rgba(15, 17, 30, 0.9)', 
                backdropFilter: 'blur(16px)',
                color: '#ffffff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
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
