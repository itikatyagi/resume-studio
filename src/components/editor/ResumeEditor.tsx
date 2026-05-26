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
      <div className="resume-editor-shell flex h-dvh max-h-dvh flex-col overflow-hidden bg-zinc-100 print:h-auto print:max-h-none print:overflow-visible print:bg-white">
        <EditorToolbar onOpenImport={() => onImportOpenChange?.(true)} />
        <ImportResumeDialog
          open={importOpen}
          onClose={() => onImportOpenChange?.(false)}
        />
        <div className="flex min-h-0 flex-1 overflow-hidden print:block print:overflow-visible">
          <aside className="no-print flex min-h-0 w-full max-w-md shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white">
            <EditorSidebar />
          </aside>
          <main className="no-print flex min-h-0 flex-1 flex-col overflow-hidden p-6">
            <p className="mb-4 shrink-0 text-center text-sm text-zinc-500">
              Live preview
            </p>
            <div className="editor-preview-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              <div className="editor-preview-canvas print-root">
                <div className="editor-preview-frame">
                  <ResumePreviewPane />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </StoreHydration>
  );
}
