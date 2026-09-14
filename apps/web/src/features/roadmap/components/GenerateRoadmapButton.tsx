"use client";

import { Button } from "../../../components/ui/button";
import { useGenerateRoadmap } from "../hooks/useRoadmap";
import { Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Input } from "../../../components/ui/input";

interface Props {
  force?: boolean;
  initialRole?: string;
}

export function GenerateRoadmapButton({ force = false, initialRole = "" }: Props) {
  const [role, setRole] = useState(initialRole);
  const generateRoadmap = useGenerateRoadmap();

  const handleGenerate = () => {
    if (!role.trim()) return;
    generateRoadmap.mutate({ targetRole: role.trim(), force });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      {!force && (
        <Input 
          placeholder="e.g. Senior Frontend Engineer" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="max-w-xs"
          disabled={generateRoadmap.isPending}
        />
      )}
      <Button 
        onClick={handleGenerate} 
        disabled={generateRoadmap.isPending || (!force && !role.trim())}
        className="w-full sm:w-auto flex items-center gap-2"
        variant={force ? "outline" : "default"}
      >
        {generateRoadmap.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {force ? "Regenerating..." : "Generating..."}
          </>
        ) : (
          <>
            {force ? <RefreshCcw className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-yellow-300" />}
            {force ? "Regenerate Roadmap" : "Generate Roadmap"}
          </>
        )}
      </Button>
    </div>
  );
}
