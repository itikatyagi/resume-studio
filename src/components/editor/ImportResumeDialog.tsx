"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResumeContent } from "@/lib/resume/schema";
import { useResumeStore } from "@/lib/resume/store";

type ImportResumeDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ImportResumeDialog({ open, onClose }: ImportResumeDialogProps) {
  const importContent = useResumeStore((s) => s.importContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSuccess() {
    setError(null);
    onClose();
  }

  async function handlePdfFile(file: File) {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import-resume", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        content?: ResumeContent;
        error?: string;
      };

      if (!response.ok || !payload.content) {
        setError(
          payload.error ??
            "Could not import this PDF. Try a text-based resume PDF.",
        );
        return;
      }

      importContent(payload.content);
      handleSuccess();
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-resume-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 id="import-resume-title" className="text-lg font-semibold text-zinc-900">
            Import resume
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm text-zinc-600">
            Upload a PDF resume. We extract your contact info, experience,
            education, skills, and projects into the editor. Your current resume
            will be replaced. Scanned image PDFs may not work — use a text-based
            PDF when possible.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            disabled={loading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handlePdfFile(file);
              e.target.value = "";
            }}
          />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {loading ? "Reading PDF…" : "Choose PDF file"}
          </Button>

          <p className="text-xs text-zinc-500">
            After import, review each section — especially dates and bullets —
            and adjust anything the parser missed.
          </p>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button
            type="button"
            variant="ghost"
            className="w-full text-zinc-500"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
