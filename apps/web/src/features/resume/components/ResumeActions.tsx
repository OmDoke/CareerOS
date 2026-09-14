import { FileText, Download, Trash2, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { format } from "date-fns";
import { resumeService } from "../services/resume.service";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resume: any;
  onDelete: () => void;
}

export function ResumeActions({ resume, onDelete }: Props) {
  const handleDownload = () => {
    // Open download url in new tab
    window.open(resumeService.downloadResumeUrl(), "_blank");
  };

  return (
    <div className="border rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{resume.originalFileName}</h3>
          <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {resume.createdAt
                ? format(new Date(resume.createdAt), "MMM dd, yyyy")
                : "Unknown date"}
            </span>
            <span>{(resume.fileSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete} className="w-full sm:w-auto flex-1">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
