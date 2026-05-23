"use client";

import Link from "next/link";
import { Download, FileJson, Printer, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/resume/store";

export function EditorToolbar() {
  const exportDocument = useResumeStore((s) => s.exportDocument);
  const importDocument = useResumeStore((s) => s.importDocument);
  const newBlank = useResumeStore((s) => s.newBlank);
  const loadSample = useResumeStore((s) => s.loadSample);
  const title = useResumeStore((s) => s.document.meta.title);
  const updateMetaTitle = useResumeStore((s) => s.updateMetaTitle);

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    const blob = new Blob([exportDocument()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase() || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      const ok = importDocument(text);
      if (!ok) alert("Invalid resume file. Please check the JSON format.");
    };
    input.click();
  }

  return (
    <header className="no-print sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3">
      <Link
        href="/"
        className="text-sm font-semibold text-zinc-900 hover:text-zinc-600"
      >
        Resume Studio
      </Link>
      <input
        type="text"
        value={title}
        onChange={(e) => updateMetaTitle(e.target.value)}
        className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm focus:border-zinc-400 focus:outline-none"
        placeholder="Resume title"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={loadSample}>
          <Sparkles className="size-4" />
          Sample
        </Button>
        <Button variant="outline" size="sm" onClick={newBlank}>
          <RotateCcw className="size-4" />
          New
        </Button>
        <Button variant="outline" size="sm" onClick={handleImport}>
          <FileJson className="size-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-4" />
          Export
        </Button>
        <Button size="sm" onClick={handlePrint}>
          <Printer className="size-4" />
          Save PDF
        </Button>
      </div>
    </header>
  );
}
