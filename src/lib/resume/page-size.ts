/** US Letter page dimensions (matches jsPDF `format: "letter"`). */
export const LETTER_WIDTH_IN = 8.5;
export const LETTER_HEIGHT_IN = 11;

export function getPxPerIn(contentWidthPx: number): number {
  return contentWidthPx / LETTER_WIDTH_IN;
}

export function countLetterPages(contentHeightPx: number, contentWidthPx: number): number {
  if (contentHeightPx <= 0 || contentWidthPx <= 0) return 1;
  const pageHeightPx = getPxPerIn(contentWidthPx) * LETTER_HEIGHT_IN;
  return Math.max(1, Math.ceil(contentHeightPx / pageHeightPx - 0.001));
}

