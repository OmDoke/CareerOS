import { Button } from "../../../components/ui/button";
import { useAnalyzeResume } from "../hooks/useAiAnalysis";
import { Loader2, Sparkles } from "lucide-react";

interface Props {
  force?: boolean;
}

export function AnalyzeResumeButton({ force = false }: Props) {
  const analyzeResume = useAnalyzeResume();

  const handleAnalyze = () => {
    analyzeResume.mutate({ force });
  };

  return (
    <Button 
      onClick={handleAnalyze} 
      disabled={analyzeResume.isPending}
      className="w-full sm:w-auto flex items-center gap-2"
    >
      {analyzeResume.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {force ? "Re-analyzing..." : "Analyzing..."}
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 text-yellow-300" />
          {force ? "Rerun AI Analysis" : "Analyze with AI"}
        </>
      )}
    </Button>
  );
}
