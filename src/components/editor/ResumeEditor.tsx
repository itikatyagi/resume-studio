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
      <div className="resume-editor-shell flex min-h-screen flex-col bg-zinc-100 print:bg-white">
        <EditorToolbar onOpenImport={() => onImportOpenChange?.(true)} />
        <ImportResumeDialog
          open={importOpen}
          onClose={() => onImportOpenChange?.(false)}
        />
        <div className="flex flex-1 overflow-hidden print:block">
          <aside className="no-print flex w-full max-w-md shrink-0 flex-col border-r border-zinc-200 bg-white">
            <EditorSidebar />
          </aside>
          <main className="flex flex-1 flex-col overflow-y-auto p-6 print:overflow-visible print:bg-white print:p-0">
            <p className="no-print mb-4 text-center text-sm text-zinc-500">
              Live preview
            </p>
            <div className="print-root mx-auto">
              <ResumePreviewPane />
            </div>
          </main>
        </div>
      </div>
    </StoreHydration>
  );
}
