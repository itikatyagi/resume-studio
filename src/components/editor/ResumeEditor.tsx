"use client";

import { ResumePreviewPane } from "./ResumePreviewPane";
import { EditorSections } from "./EditorSections";
import { EditorToolbar } from "./EditorToolbar";
import { StoreHydration } from "./StoreHydration";

export function ResumeEditor() {
  return (
    <StoreHydration>
      <div className="flex min-h-screen flex-col bg-zinc-100">
        <EditorToolbar />
        <div className="flex flex-1 overflow-hidden">
          <aside className="no-print w-full max-w-md shrink-0 overflow-y-auto border-r border-zinc-200 bg-white">
            <div className="p-4">
              <EditorSections />
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto p-6 print:p-0">
            <p className="no-print mb-4 text-center text-sm text-zinc-500">
              Live preview
            </p>
            <ResumePreviewPane />
          </main>
        </div>
      </div>
    </StoreHydration>
  );
}
