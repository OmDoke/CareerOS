import { ResumeInfoForm } from "./ResumeInfoForm";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resume: any;
}

export function ResumePreviewCard({ resume }: Props) {
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
        <h3 className="text-xl font-semibold mb-4">Edit Extracted Details</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Review and manually edit the details parsed from your resume. 
          This information will be used for your AI interview preparation.
        </p>
        
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
