"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { ResumeDocument } from "@/components/resume-template";
import { Button } from "@/components/ui/button";
import { createSampleResume } from "@/lib/resume/defaults";
import "@/styles/resume-print.css";

export default function PreviewPage() {
  const document = createSampleResume();

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
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            Save PDF
          </Button>
        </div>
      </div>
      <ResumeDocument document={document} />
    </main>
  );
}
