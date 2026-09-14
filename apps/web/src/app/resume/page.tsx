"use client";

import { useState } from "react";
import { useResume } from "../../features/resume/hooks/useResume";
import { ResumeUploadCard } from "../../features/resume/components/ResumeUploadCard";
import { ResumePreviewCard } from "../../features/resume/components/ResumePreviewCard";
import { ResumeActions } from "../../features/resume/components/ResumeActions";
import { DeleteResumeDialog } from "../../features/resume/components/DeleteResumeDialog";
import { Loader2 } from "lucide-react";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";

export default function ResumePage() {
  const { data: resume, isLoading } = useResume();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your resume...</p>
        </div>
      </ProtectedLayout>
    );
  }

  // Handle case where user has no resume or fetch failed with 404
  const hasResume = !!resume;

  return (
    <ProtectedLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your resume to personalize your interview preparation.
        </p>
      </div>

      {!hasResume ? (
        <div className="bg-card border rounded-lg p-8">
          <ResumeUploadCard />
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Active Resume</h2>
            <ResumeActions resume={resume} onDelete={() => setIsDeleteDialogOpen(true)} />
          </section>

          <section>
            <ResumePreviewCard resume={resume} />
          </section>

          <DeleteResumeDialog 
            isOpen={isDeleteDialogOpen} 
            onClose={() => setIsDeleteDialogOpen(false)} 
          />
        </div>
      )}
      </div>
    </ProtectedLayout>
  );
}
