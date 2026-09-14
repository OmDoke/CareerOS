"use client";

import { useCompleteSession } from "../hooks/useStudySession";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  sessionId: string;
  disabled?: boolean;
}

export function CompleteSessionButton({ sessionId, disabled = false }: Props) {
  const completeSession = useCompleteSession();

  const handleComplete = () => {
    completeSession.mutate(sessionId);
  };

  return (
    <Button
      onClick={handleComplete}
      disabled={disabled || completeSession.isPending}
      className="flex items-center gap-2"
      size="lg"
    >
      {completeSession.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Completing...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Complete Session
        </>
      )}
    </Button>
  );
}
