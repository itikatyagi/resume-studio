import type { ResumeDocument } from "./schema";

export const PRINT_SESSION_KEY = "resume-studio-print";

/** Stage the current document and open a print-only view (resume content only). */
export function openPrintView(document: ResumeDocument): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(PRINT_SESSION_KEY, JSON.stringify(document));
  } catch {
  }

  const printWindow = window.open("/print", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    window.location.assign("/print");
  }
}

export function readPrintDocument(): ResumeDocument | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(PRINT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ResumeDocument;
  } catch {
    return null;
  }
}

export function clearPrintDocument(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PRINT_SESSION_KEY);
  } catch {
  }
}
