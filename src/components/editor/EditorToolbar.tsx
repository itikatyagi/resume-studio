"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Download,
  FileUp,
  Loader2,
  Palette,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  downloadResumePdf,
  findResumePageElement,
} from "@/lib/resume/download-pdf";
import { getEffectiveLayout } from "@/lib/resume/layout-utils";
import { THEME_LIST } from "@/lib/resume/themes";
import { useResumeStore } from "@/lib/resume/store";

type EditorToolbarProps = {
  onOpenImport?: () => void;
};

export function EditorToolbar({ onOpenImport }: EditorToolbarProps) {
  const exportDocument = useResumeStore((s) => s.exportDocument);
  const newBlank = useResumeStore((s) => s.newBlank);
  const loadSample = useResumeStore((s) => s.loadSample);
  const title = useResumeStore((s) => s.document.meta.title);
  const document = useResumeStore((s) => s.document);
  const applyTheme = useResumeStore((s) => s.applyTheme);
  const updateMetaTitle = useResumeStore((s) => s.updateMetaTitle);
  const [pdfLoading, setPdfLoading] = useState(false);

  const layout = getEffectiveLayout(document);
  const activeTheme = layout.themeId ?? "novo-blue";

  async function handleSavePdf() {
    const page = findResumePageElement(window.document);
    if (!page) return;

    setPdfLoading(true);
    try {
      const filename =
        document.content.profile.fullName.trim() ||
        title.trim() ||
        "resume";
      await downloadResumePdf(page, filename);
    } finally {
      setPdfLoading(false);
    }
  }

  function handleExport() {
    const blob = new Blob([exportDocument()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase() || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <Palette className="size-4 shrink-0" />
        <select
          value={activeTheme}
          onChange={(e) => applyTheme(e.target.value)}
          className="max-w-[11rem] rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm focus:border-zinc-400 focus:outline-none"
        >
          {THEME_LIST.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onOpenImport}>
          <FileUp className="size-4" />
          Import resume
        </Button>
        <Button variant="outline" size="sm" onClick={loadSample}>
          <Sparkles className="size-4" />
          Sample
        </Button>
        <Button variant="outline" size="sm" onClick={newBlank}>
          <RotateCcw className="size-4" />
          New
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-4" />
          Export
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
    </header>
  );
}
