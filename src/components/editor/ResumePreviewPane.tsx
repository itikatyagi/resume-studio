"use client";

import { useDeferredValue } from "react";
import { ResumeDocument } from "@/components/resume-template/ResumeDocument";
import { useResumeStore } from "@/lib/resume/store";

export function ResumePreviewPane() {
  const document = useResumeStore((s) => s.document);
  const deferredDocument = useDeferredValue(document);
  const isPending = document !== deferredDocument;

  return (
    <div
      className={`transition-opacity duration-150 ${isPending ? "opacity-70" : "opacity-100"}`}
    >
      <ResumeDocument document={deferredDocument} />
    </div>
  );
}
