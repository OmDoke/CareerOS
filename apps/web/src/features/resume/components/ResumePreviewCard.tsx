import { ResumeInfoForm } from "./ResumeInfoForm";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resume: any;
}

export function ResumePreviewCard({ resume }: Props) {
  const hasAiData = !!(resume.name || resume.skills || resume.experience);

  const initialData = {
    name: resume.name || "",
    email: resume.email || "",
    phone: resume.phone || "",
    skills: resume.skills || "",
    education: resume.education || "",
    experience: resume.experience || "",
    projects: resume.projects || "",
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold">Edit Extracted Details</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {hasAiData
                ? "These details were extracted by AI. You can edit them manually below."
                : "Fields are empty until you run AI Analysis. You can also fill them manually."}
            </p>
          </div>
          {!hasAiData && (
            <Link
              href="/resume/analysis"
              className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4" />
              Run AI Analysis
            </Link>
          )}
        </div>

        <ResumeInfoForm initialData={initialData} />
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Raw Extracted Text</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This is the raw text extracted from your PDF. You can use this to verify if the parsing worked correctly.
        </p>
        <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
          {resume.extractedText || "No text could be extracted from this PDF."}
        </div>
      </div>
    </div>
  );
}
