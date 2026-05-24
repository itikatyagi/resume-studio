"use client";

import { useEffect, useState } from "react";
import { ResumeDocument as ResumeDocumentView } from "@/components/resume-template";
import { downloadResumePdf, findResumePageElement } from "@/lib/resume/download-pdf";
import { migrateResume } from "@/lib/resume/migrations";
import {
  clearPrintDocument,
  readPrintDocument,
} from "@/lib/resume/print";
import { resumeDocumentSchema, type ResumeDocument } from "@/lib/resume/schema";

const STORAGE_KEY = "resume-studio-document";

function loadDocument(): ResumeDocument | null {
  const staged = readPrintDocument();
  if (staged) return migrateResume(staged);

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = resumeDocumentSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return migrateResume(parsed.data);
  } catch {
  }

  return null;
}

export default function PrintPage() {
  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [status, setStatus] = useState("Preparing PDF…");

  useEffect(() => {
    setResume(loadDocument());
  }, []);

  useEffect(() => {
    if (!resume) return;

    const name = resume.content.profile.fullName?.trim() || "resume";

    const timer = window.setTimeout(async () => {
      const page = findResumePageElement(window.document);
      if (!page) {
        setStatus("Could not render resume for export.");
        return;
      }

      try {
        await downloadResumePdf(page, name);
        setStatus("PDF downloaded.");
        clearPrintDocument();
      } catch {
        setStatus("PDF export failed. Try again from the editor.");
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [resume]);

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-sm text-zinc-600">
        <p>
          No resume to export. Open the editor, add your content, then use{" "}
          <strong>Save PDF</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="print-root">
      <p className="no-print fixed inset-x-0 top-4 text-center text-sm text-zinc-500">
        {status}
      </p>
      <ResumeDocumentView document={resume} />
    </div>
  );
}
