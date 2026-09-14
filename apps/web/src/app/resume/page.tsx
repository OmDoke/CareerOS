"use client";

import { useState } from "react";
import { useResume } from "../../features/resume/hooks/useResume";
import { ResumeUploadCard } from "../../features/resume/components/ResumeUploadCard";
import { ResumePreviewCard } from "../../features/resume/components/ResumePreviewCard";
import { ResumeActions } from "../../features/resume/components/ResumeActions";
import { DeleteResumeDialog } from "../../features/resume/components/DeleteResumeDialog";
import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import * as motion from "framer-motion/client";

export default function ResumePage() {
  const { data: resume, isLoading } = useResume();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <ProtectedLayout>
        <SpinnerSkeleton />
      </ProtectedLayout>
    );
  }

  const hasResume = !!resume;

  return (
    <ProtectedLayout>
      <div className="animate-in fade-in duration-500">
        <PageHeader 
          title="Resume Management"
          description="Upload and manage your resume to personalize your interview preparation."
          breadcrumbItems={[{ label: "Resume" }]}
        />

        {!hasResume ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <ResumeUploadCard />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
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
          </motion.div>
        )}
      </div>
    </ProtectedLayout>
  );
}
