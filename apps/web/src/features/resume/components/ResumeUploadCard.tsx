import { useState } from "react";
import { UploadCloud, File, AlertCircle } from "lucide-react";
import { useUploadResume } from "../hooks/useResume";
import { Button } from "../../../components/ui/button";
import { UploadProgress } from "./UploadProgress";

interface Props {
  onSuccess?: () => void;
}

export function ResumeUploadCard({ onSuccess }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const uploadResume = useUploadResume();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMsg("");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setErrorMsg("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size must be less than 10MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadResume.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        if (onSuccess) onSuccess();
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setErrorMsg(err.response?.data?.message || "Failed to upload resume.");
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors
          ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-background hover:bg-muted/50"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Upload your resume</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your PDF here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">Maximum size: 10MB</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          {errorMsg}
        </div>
      )}

      {selectedFile && (
        <div className="mt-4 p-4 border rounded-md flex items-center justify-between bg-card">
          <div className="flex items-center gap-3 overflow-hidden">
            <File className="h-8 w-8 text-blue-500 shrink-0" />
            <div className="truncate">
              <p className="font-medium text-sm truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {uploadResume.isPending ? null : (
            <Button
              onClick={handleUpload}
              disabled={uploadResume.isPending}
              size="sm"
            >
              Upload
            </Button>
          )}
        </div>
      )}

      <UploadProgress isUploading={uploadResume.isPending} />
    </div>
  );
}
