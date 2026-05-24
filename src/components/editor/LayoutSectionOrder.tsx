"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { LayoutConfig, LayoutSectionId } from "@/lib/resume/layout-schema";
import {
  SECTION_LABELS,
  getHiddenLayoutSections,
  moveSectionInList,
  setSectionColumn,
} from "@/lib/resume/layout-utils";

function SectionRow({
  sectionId,
  index,
  listLength,
  columnKey,
  list,
  onApply,
  twoColumn,
  layout,
}: {
  sectionId: LayoutSectionId;
  index: number;
  listLength: number;
  columnKey: "sidebarSections" | "mainSections";
  list: LayoutSectionId[];
  onApply: (patch: Partial<LayoutConfig>) => void;
  twoColumn: boolean;
  layout: LayoutConfig;
}) {
  const currentColumn =
    columnKey === "sidebarSections" ? "sidebar" : "main";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-100 bg-zinc-50/80 px-2 py-1.5">
      <Label className="text-sm">{SECTION_LABELS[sectionId]}</Label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={index <= 0}
          onClick={() =>
            onApply({
              [columnKey]: moveSectionInList(list, index, -1),
            })
          }
          className="rounded p-1 text-zinc-500 hover:bg-zinc-200 disabled:opacity-30"
          aria-label={`Move ${SECTION_LABELS[sectionId]} up`}
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          disabled={index >= listLength - 1}
          onClick={() =>
            onApply({
              [columnKey]: moveSectionInList(list, index, 1),
            })
          }
          className="rounded p-1 text-zinc-500 hover:bg-zinc-200 disabled:opacity-30"
          aria-label={`Move ${SECTION_LABELS[sectionId]} down`}
        >
          <ChevronDown className="size-4" />
        </button>
        <select
          value={currentColumn}
          onChange={(e) => {
            const col = e.target.value as "sidebar" | "main" | "hidden";
            const next = setSectionColumn(layout, sectionId, col);
            onApply({
              sidebarSections: next.sidebarSections,
              mainSections: next.mainSections,
            });
          }}
          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm"
        >
          {twoColumn && <option value="sidebar">Sidebar</option>}
          <option value="main">Main</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
    </div>
  );
}

export function LayoutSectionOrder({
  layout,
  onApply,
}: {
  layout: LayoutConfig;
  onApply: (patch: Partial<LayoutConfig>) => void;
}) {
  const hidden = getHiddenLayoutSections(layout);
  const twoColumn = layout.structure === "header-sidebar-main";

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">
        Place sections in the sidebar or main column, reorder with the arrows, or
        hide sections you do not need.
      </p>

      {twoColumn && layout.sidebarSections.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Sidebar (top → bottom)
          </p>
          {layout.sidebarSections.map((sectionId, index) => (
            <SectionRow
              key={sectionId}
              sectionId={sectionId}
              index={index}
              listLength={layout.sidebarSections.length}
              columnKey="sidebarSections"
              list={layout.sidebarSections}
              onApply={onApply}
              twoColumn={twoColumn}
              layout={layout}
            />
          ))}
        </div>
      )}

      {layout.mainSections.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {twoColumn ? "Main column (top → bottom)" : "Section order (top → bottom)"}
          </p>
          {layout.mainSections.map((sectionId, index) => (
            <SectionRow
              key={sectionId}
              sectionId={sectionId}
              index={index}
              listLength={layout.mainSections.length}
              columnKey="mainSections"
              list={layout.mainSections}
              onApply={onApply}
              twoColumn={twoColumn}
              layout={layout}
            />
          ))}
        </div>
      )}

      {hidden.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Hidden
          </p>
          {hidden.map((sectionId) => (
            <div
              key={sectionId}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed border-zinc-200 bg-zinc-50/50 px-2 py-1.5"
            >
              <Label className="text-sm text-zinc-500">
                {SECTION_LABELS[sectionId]}
              </Label>
              <select
                value="hidden"
                onChange={(e) => {
                  const col = e.target.value as "sidebar" | "main" | "hidden";
                  const next = setSectionColumn(layout, sectionId, col);
                  onApply({
                    sidebarSections: next.sidebarSections,
                    mainSections: next.mainSections,
                  });
                }}
                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm"
              >
                {twoColumn && <option value="sidebar">Sidebar</option>}
                <option value="main">Main</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
