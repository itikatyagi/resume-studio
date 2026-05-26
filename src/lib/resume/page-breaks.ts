import {
  getPxPerIn,
  LETTER_HEIGHT_IN,
  LETTER_WIDTH_IN,
} from "./page-size";

export type PageSlice = {
  offsetIn: number;
  heightIn: number;
};

const BLOCK_SELECTOR =
  ".config-header, section.resume-section, section.summary-section, section.skills-section, section.education-section, section.experience-section, section.projects-section, section.custom-section";

const MIN_SLICE_IN = 0.35;

/** ~96dpi fallback when off-screen measure reports 0 width */
const FALLBACK_WIDTH_PX = LETTER_WIDTH_IN * 96;

function resolveContentWidthPx(article: HTMLElement, fallbackWidthPx?: number): number {
  const measured = article.getBoundingClientRect().width;
  if (measured > 10) return measured;
  if (fallbackWidthPx && fallbackWidthPx > 10) return fallbackWidthPx;
  return FALLBACK_WIDTH_PX;
}

function getBlockBounds(article: HTMLElement) {
  const articleRect = article.getBoundingClientRect();
  const originY = articleRect.top - article.scrollTop;
  const blocks: { top: number; bottom: number; height: number }[] = [];

  article.querySelectorAll(BLOCK_SELECTOR).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const rect = node.getBoundingClientRect();
    const height = Math.max(rect.height, node.offsetHeight);
    if (height < 1) return;

    const top = rect.top - originY;
    blocks.push({ top, bottom: top + height, height });
  });

  return blocks.sort((a, b) => a.top - b.top);
}

function shouldMoveBlockToNextPage(
  block: { top: number; bottom: number; height: number },
  pageStartPx: number,
  pageEndPx: number,
  pageHeightPx: number,
  minSlicePx: number,
): boolean {
  if (block.height > pageHeightPx + 1) return false;
  if (block.top <= pageStartPx + minSlicePx) return false;

  const startsOnPage = block.top >= pageStartPx && block.top < pageEndPx - 1;
  const crossesBreak = block.top < pageEndPx - 1 && block.bottom > pageEndPx + 1;
  const spaceBelowStart = pageEndPx - block.top;

  if (!startsOnPage && !crossesBreak) return false;

  return crossesBreak || (startsOnPage && block.height > spaceBelowStart + 1);
}

/**
 * Letter page slices that avoid splitting a section across pages when the
 * whole section fits on one sheet.
 */
export function computeLetterPageSlices(
  article: HTMLElement,
  fallbackWidthPx?: number,
): PageSlice[] {
  const width = resolveContentWidthPx(article, fallbackWidthPx);
  const pxPerIn = getPxPerIn(width);
  const pageHeightPx = pxPerIn * LETTER_HEIGHT_IN;
  const minSlicePx = pxPerIn * MIN_SLICE_IN;
  const totalPx = Math.max(article.scrollHeight, article.offsetHeight);
  const blocks = getBlockBounds(article);

  if (totalPx < 1) {
    return [{ offsetIn: 0, heightIn: LETTER_HEIGHT_IN }];
  }

  if (totalPx <= pageHeightPx + 1) {
    return [
      {
        offsetIn: 0,
        heightIn: Math.max(totalPx / pxPerIn, LETTER_HEIGHT_IN),
      },
    ];
  }

  const slices: PageSlice[] = [];
  let pageStartPx = 0;

  while (pageStartPx < totalPx - 1) {
    let pageEndPx = Math.min(pageStartPx + pageHeightPx, totalPx);
    let adjusted = true;

    while (adjusted) {
      adjusted = false;
      for (const block of blocks) {
        if (
          shouldMoveBlockToNextPage(
            block,
            pageStartPx,
            pageEndPx,
            pageHeightPx,
            minSlicePx,
          )
        ) {
          pageEndPx = block.top;
          adjusted = true;
        }
      }
    }

    if (pageEndPx <= pageStartPx + minSlicePx) {
      pageEndPx = Math.min(pageStartPx + pageHeightPx, totalPx);
    }

    slices.push({
      offsetIn: pageStartPx / pxPerIn,
      heightIn: (pageEndPx - pageStartPx) / pxPerIn,
    });
    pageStartPx = pageEndPx;
  }

  if (slices.length === 0) {
    return [{ offsetIn: 0, heightIn: Math.min(LETTER_HEIGHT_IN, totalPx / pxPerIn) }];
  }

  return slices;
}

export function sliceHeightsPx(
  slices: PageSlice[],
  contentWidthPx: number,
  scale = 1,
): number[] {
  const pxPerIn = getPxPerIn(contentWidthPx > 10 ? contentWidthPx : FALLBACK_WIDTH_PX);
  return slices.map((slice) => Math.round(slice.heightIn * pxPerIn * scale));
}
