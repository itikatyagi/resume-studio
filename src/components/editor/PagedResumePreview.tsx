"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ResumeDocument } from "@/components/resume-template/ResumeDocument";
import type { ResumeDocument as ResumeDocumentType } from "@/lib/resume/schema";
import {
  computeLetterPageSlices,
  type PageSlice,
} from "@/lib/resume/page-breaks";
import { getEffectiveLayout } from "@/lib/resume/layout-utils";
import { isItikaLayout } from "@/lib/resume/is-itika-layout";
import {
  getPxPerIn,
  LETTER_HEIGHT_IN,
  LETTER_WIDTH_IN,
} from "@/lib/resume/page-size";

type PagedResumePreviewProps = {
  document: ResumeDocumentType;
};

const DEFAULT_SLICES: PageSlice[] = [{ offsetIn: 0, heightIn: LETTER_HEIGHT_IN }];

/** Editor slots use full letter height so content is never clipped to a tiny measure sliver. */
function slotViewportHeightIn(slice: PageSlice, pageCount: number): number {
  if (pageCount === 1) return LETTER_HEIGHT_IN;
  return Math.max(slice.heightIn, 0.5);
}

/**
 * Editor preview: one letter-sized card per page (matches PDF page count).
 * Off-screen copy is used for measurement + PDF export only.
 */
export function PagedResumePreview({ document }: PagedResumePreviewProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [slices, setSlices] = useState<PageSlice[]>(DEFAULT_SLICES);

  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) return;

    const measure = () => {
      const article = root.querySelector(".resume-page") as HTMLElement | null;
      if (!article) return;

      const width =
        article.getBoundingClientRect().width ||
        root.getBoundingClientRect().width;

      const next = computeLetterPageSlices(article, width);
      const pxPerIn = getPxPerIn(width);
      const contentHeightIn =
        Math.max(article.scrollHeight, article.offsetHeight) / pxPerIn;

      const normalized =
        next.length === 1 && next[0].heightIn < LETTER_HEIGHT_IN * 0.5
          ? [
              {
                offsetIn: 0,
                heightIn: Math.max(contentHeightIn, LETTER_HEIGHT_IN),
              },
            ]
          : next;

      setSlices(normalized);
    };

    let cancelled = false;
    const run = () => {
      if (!cancelled) measure();
    };

    run();
    const raf = requestAnimationFrame(run);
    void globalThis.document?.fonts?.ready.then(run);

    const ro = new ResizeObserver(run);
    const article = root.querySelector(".resume-page");
    if (article) ro.observe(article);
    ro.observe(root);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [document]);

  const layout = getEffectiveLayout(document);
  const pageCount = slices.length;

  return (
    <div className="resume-paged-preview flex w-full flex-col items-center">
      <div
        ref={measureRef}
        className="resume-page-pdf-source pointer-events-none fixed top-0 -left-[10000px] z-[-1] w-[8.5in] opacity-0"
        aria-hidden
      >
        <ResumeDocument document={document} />
      </div>

      <div
        className="resume-preview-pages flex w-full flex-col items-center gap-4"
        data-page-count={pageCount}
      >
        {slices.map((slice, pageIndex) => {
          const viewportHeightIn = slotViewportHeightIn(slice, pageCount);
          return (
            <div
              key={`page-${pageIndex}-${slice.offsetIn.toFixed(3)}`}
              className="resume-page-slot relative shrink-0 overflow-hidden bg-white shadow-md"
              style={{
                width: `${LETTER_WIDTH_IN}in`,
                maxWidth: "100%",
                height: `${viewportHeightIn}in`,
              }}
              data-page={pageIndex + 1}
              aria-label={`Page ${pageIndex + 1} of ${pageCount}`}
            >
              <div
                className="resume-page-slice absolute left-0 top-0 w-[8.5in] max-w-full"
                style={{
                  transform: `translate3d(0, calc(-1 * ${slice.offsetIn}in), 0)`,
                }}
              >
                <ResumeDocument document={document} />
              </div>
              {isItikaLayout(layout) && (
                <p className="itika-page-footer" aria-hidden>
                  Page {pageIndex + 1} of {pageCount}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
