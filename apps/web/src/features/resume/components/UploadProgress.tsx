import { Loader2 } from "lucide-react";

interface Props {
  isUploading: boolean;
}

export function UploadProgress({ isUploading }: Props) {
  if (!isUploading) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-md bg-muted text-sm text-muted-foreground mt-4 border border-primary/20">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span>Uploading and parsing your resume. This may take a few seconds...</span>
    </div>
  );
}
