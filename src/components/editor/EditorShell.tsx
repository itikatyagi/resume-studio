"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isTemplateId } from "@/components/resume-template/registry";
import { isThemeId, resolveThemeId } from "@/lib/resume/themes";
import { useResumeStore } from "@/lib/resume/store";
import { ResumeEditor } from "./ResumeEditor";

export function EditorShell() {
  const searchParams = useSearchParams();
  const hydrated = useResumeStore((s) => s.hydrated);
  const startWithTemplate = useResumeStore((s) => s.startWithTemplate);
  const applyTheme = useResumeStore((s) => s.applyTheme);
  const loadSample = useResumeStore((s) => s.loadSample);
  const [importOpen, setImportOpen] = useState(false);
  const appliedQuery = useRef(false);

  useEffect(() => {
    if (!hydrated || appliedQuery.current) return;

    const themeParam = searchParams.get("theme");
    const templateParam = searchParams.get("template");
    const sample = searchParams.get("sample");
    const importParam = searchParams.get("import");

    if (importParam === "1") {
      setImportOpen(true);
      appliedQuery.current = true;
    } else if (themeParam && isThemeId(themeParam)) {
      startWithTemplate("universal-v1");
      applyTheme(themeParam);
      appliedQuery.current = true;
    } else if (templateParam) {
      const themeId = resolveThemeId(templateParam);
      if (themeId) {
        startWithTemplate("universal-v1");
        applyTheme(themeId);
      } else if (isTemplateId(templateParam)) {
        startWithTemplate(templateParam);
      }
      appliedQuery.current = true;
    } else if (sample === "1") {
      loadSample();
      appliedQuery.current = true;
    }
  }, [
    hydrated,
    searchParams,
    startWithTemplate,
    applyTheme,
    loadSample,
  ]);

  return (
    <ResumeEditor importOpen={importOpen} onImportOpenChange={setImportOpen} />
  );
}
