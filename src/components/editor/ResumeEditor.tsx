"use client";

import { ResumePreviewPane } from "./ResumePreviewPane";
import { EditorSidebar } from "./EditorSidebar";
import { EditorToolbar } from "./EditorToolbar";
import { ImportResumeDialog } from "./ImportResumeDialog";
import { StoreHydration } from "./StoreHydration";

type ResumeEditorProps = {
  importOpen?: boolean;
  onImportOpenChange?: (open: boolean) => void;
};

export function ResumeEditor({
  importOpen = false,
  onImportOpenChange,
}: ResumeEditorProps) {
  return (
    <StoreHydration>
      <div className="flex min-h-screen flex-col bg-zinc-100">
        <EditorToolbar onOpenImport={() => onImportOpenChange?.(true)} />
        <ImportResumeDialog
          open={importOpen}
          onClose={() => onImportOpenChange?.(false)}
        />
        <div className="flex flex-1 overflow-hidden">
          <aside className="no-print flex w-full max-w-md shrink-0 flex-col border-r border-zinc-200 bg-white">
            <EditorSidebar />
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
