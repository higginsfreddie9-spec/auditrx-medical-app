"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";

interface FileDropzoneProps {
  label: string;
  hint: string;
  file: File | null;
  onFileSelected: (file: File | null) => void;
  accent?: "flag" | "verified";
}

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

export default function FileDropzone({
  label,
  hint,
  file,
  onFileSelected,
  accent = "flag",
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;
      if (!ACCEPTED_TYPES.includes(candidate.type)) {
        setError("Please upload a PDF, PNG, JPG, or WEBP file.");
        return;
      }
      if (candidate.size > 15 * 1024 * 1024) {
        setError("File is larger than 15MB.");
        return;
      }
      setError(null);
      onFileSelected(candidate);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      validateAndSet(e.dataTransfer.files?.[0]);
    },
    [validateAndSet]
  );

  const accentClasses =
    accent === "flag"
      ? "border-flag/40 bg-flag-bg/40"
      : "border-verified/40 bg-verified-bg/40";

  return (
    <div>
      <p className="font-mono text-xs font-medium uppercase tracking-wide text-ink">
        {label}
      </p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-2 flex min-h-[148px] cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed p-5 text-center transition-colors ${
          isDragging
            ? "border-ink bg-white"
            : file
            ? accentClasses
            : "border-hairline bg-white hover:border-ink/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />

        {file ? (
          <>
            <FileCheck2
              size={22}
              className={accent === "flag" ? "text-flag" : "text-verified"}
            />
            <p className="max-w-[220px] truncate font-mono text-xs text-ink">
              {file.name}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelected(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-slate hover:text-flag"
            >
              <X size={12} /> Remove
            </button>
          </>
        ) : (
          <>
            <UploadCloud size={22} className="text-slate-dim" />
            <p className="font-body text-sm text-ink">{hint}</p>
            <p className="font-mono text-[11px] text-slate-dim">
              PDF, PNG, JPG · up to 15MB
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-1.5 font-mono text-[11px] text-flag">{error}</p>
      )}
    </div>
  );
}
