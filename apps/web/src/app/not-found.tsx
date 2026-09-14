import { EmptyState } from "@/components/shared/EmptyState";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <EmptyState
          icon={FileQuestion}
          title="Page Not Found"
          description="We couldn't find the page you're looking for. It might have been moved or deleted."
          primaryAction={{
            label: "Go to Dashboard",
            href: "/dashboard",
          }}
        />
      </div>
    </div>
  );
}
