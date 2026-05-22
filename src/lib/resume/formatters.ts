/**
 * Display helpers — dates, ordering, empty-section checks.
 * Step 0.4: implement full formatting logic.
 */

export function formatDateRange(
  _start?: string,
  _end?: string,
  _current?: boolean,
): string {
  return "";
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function hasResumeContent(_content: Record<string, unknown>): boolean {
  return false;
}
