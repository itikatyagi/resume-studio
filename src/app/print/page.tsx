"use client";

import { useEffect, useState } from "react";
import { ResumeDocument as ResumeDocumentView } from "@/components/resume-template";
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const doc = loadDocument();
    setResume(doc);

    const name = doc?.content.profile.fullName?.trim();
    window.document.title = name || "Resume";
  }, []);

  useEffect(() => {
    if (!resume) return;

    const timer = window.setTimeout(() => {
      setReady(true);
      window.print();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [resume]);

  useEffect(() => {
    const onAfterPrint = () => clearPrintDocument();
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  if (!resume) {
    return (
      <div className="no-print flex min-h-screen items-center justify-center p-8 text-center text-sm text-zinc-600">
        <p>
          No resume to print. Open the editor, add your content, then use{" "}
          <strong>Save PDF</strong> again.
        </p>
      </div>
    );
  }

  return (
    <div className="print-root">
      {!ready && (
        <p className="no-print fixed inset-x-0 top-4 text-center text-sm text-zinc-500">
          Preparing print…
        </p>
      )}
      <p className="no-print fixed inset-x-0 bottom-4 px-6 text-center text-xs text-zinc-400">
        In the print dialog, turn off <strong>Headers and footers</strong> for a
        clean PDF with only your resume.
      </p>
      <ResumeDocumentView document={resume} />
    </div>
  );
}
