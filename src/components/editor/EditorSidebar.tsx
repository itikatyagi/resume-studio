"use client";

import { useState } from "react";
import { AtsScorePanel } from "./AtsScorePanel";
import { EditorSections } from "./EditorSections";
import { JobsPanel } from "./JobsPanel";
import { LayoutPanel } from "./LayoutPanel";

type EditorTab = "content" | "layout" | "ats" | "jobs";

export function EditorSidebar() {
  const [tab, setTab] = useState<EditorTab>("content");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="no-print flex shrink-0 gap-1 border-b border-zinc-200 p-2">
        <button
          type="button"
          onClick={() => setTab("content")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "content"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setTab("layout")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "layout"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Layout
        </button>
        <button
          type="button"
          onClick={() => setTab("ats")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "ats"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          ATS
        </button>
        <button
          type="button"
          onClick={() => setTab("jobs")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "jobs"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Jobs
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4">
        {tab === "content" && <EditorSections />}
        {tab === "layout" && <LayoutPanel />}
        {tab === "ats" && <AtsScorePanel />}
        {tab === "jobs" && <JobsPanel />}
      </div>
    </div>
  );
}
