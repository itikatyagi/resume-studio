"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Printer } from "lucide-react";
import { ResumeDocument } from "@/components/resume-template";
import { Button } from "@/components/ui/button";
import { downloadResumePdf, findResumePageElement } from "@/lib/resume/download-pdf";
import { createSampleResume } from "@/lib/resume/defaults";
import "@/styles/resume-print.css";

export default function PreviewPage() {
  const document = createSampleResume();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleSavePdf() {
    const page = findResumePageElement(window.document);
    if (!page) return;

    setPdfLoading(true);
    try {
      await downloadResumePdf(
        page,
        document.content.profile.fullName || "resume",
      );
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <main className="min-h-full bg-zinc-100 py-8">
      <div className="no-print mx-auto mb-4 flex max-w-[816px] items-center justify-between px-4">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back
        </Link>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/editor">Open editor</Link>
          </Button>
          <Button size="sm" onClick={handleSavePdf} disabled={pdfLoading}>
            {pdfLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Printer className="size-4" />
            )}
            {pdfLoading ? "Saving…" : "Save PDF"}
          </Button>
        </div>
      </div>
      <ResumeDocument document={document} />
    </main>
  );
}
