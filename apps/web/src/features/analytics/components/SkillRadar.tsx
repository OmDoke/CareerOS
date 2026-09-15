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
    <Card className="h-full border-none shadow-md">
      <CardHeader>
        <CardTitle>Skill Radar</CardTitle>
        <CardDescription>Your current proficiency across key areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid strokeOpacity={0.2} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }} 
              />
              <Radar
                name="Proficiency"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
