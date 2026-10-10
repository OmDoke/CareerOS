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
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all backdrop-blur-xl shadow-soft
          ${dragActive 
            ? "border-primary bg-primary/10 scale-[1.01]" 
            : "border-slate-300 bg-white/80 hover:bg-white hover:border-primary/40 shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]"}`}
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
        <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Upload your resume</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Drag and drop your PDF resume here, or click anywhere to select from your files
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full mt-1">
            PDF only • Max 10MB
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {selectedFile && (
        <div className="mt-4 p-4 rounded-2xl border border-slate-200/90 bg-white/95 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <File className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="font-bold text-xs text-slate-900 truncate">{selectedFile.name}</p>
              <p className="text-[10px] font-medium text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {uploadResume.isPending ? null : (
            <button
              onClick={handleUpload}
              disabled={uploadResume.isPending}
              className="rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[10px] px-6 py-2.5 shadow-md shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              Analyze Resume
            </button>
          )}
        </div>
      )}

      <UploadProgress isUploading={uploadResume.isPending} />
    </div>
  );
}
