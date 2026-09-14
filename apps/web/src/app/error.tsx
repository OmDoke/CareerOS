"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <EmptyState
          icon={AlertTriangle}
          title="Something went wrong"
          description={error.message || "An unexpected error occurred while processing your request."}
          primaryAction={{
            label: "Try Again",
            onClick: () => reset(),
          }}
          secondaryAction={{
            label: "Go to Dashboard",
            href: "/dashboard",
          }}
        />
      </div>
    </div>
  );
}
