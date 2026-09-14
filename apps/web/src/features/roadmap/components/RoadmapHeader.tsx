"use client";

import { Target, Clock, Trophy } from "lucide-react";
import { GenerateRoadmapButton } from "./GenerateRoadmapButton";

interface Props {
  title: string;
  targetRole: string;
  currentLevel: string;
  estimatedWeeks: number;
}

export function RoadmapHeader({ title, targetRole, currentLevel, estimatedWeeks }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-card border rounded-lg mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            <span className="font-medium text-foreground">Target Role:</span> {targetRole}
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" />
            <span className="font-medium text-foreground">Current Level:</span> {currentLevel}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="font-medium text-foreground">Estimated Time:</span> {estimatedWeeks} Weeks
          </div>
        </div>
      </div>
      <div>
        <GenerateRoadmapButton force={true} initialRole={targetRole} />
      </div>
    </div>
  );
}
