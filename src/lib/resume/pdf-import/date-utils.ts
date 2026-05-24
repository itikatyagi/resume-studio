const MONTH_MAP: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

/** Normalize loose PDF dates to YYYY or YYYY-MM for the resume schema. */
export function normalizeDateToken(token: string): string | undefined {
  const raw = token.trim().replace(/\./g, "");
  if (!raw) return undefined;

  const lower = raw.toLowerCase();
  if (lower === "present" || lower === "current" || lower === "now") {
    return undefined;
  }

  const iso = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
  if (iso) {
    const year = iso[1];
    const month = iso[2];
    if (month && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
      return year;
    }
    return month ? `${year}-${month}` : year;
  }

  const slash = raw.match(/^(\d{1,2})\/(\d{4})$/);
  if (slash) {
    const month = slash[1].padStart(2, "0");
    return `${slash[2]}-${month}`;
  }

  const monthYear = raw.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTH_MAP[monthYear[1].toLowerCase()];
    if (month) return `${monthYear[2]}-${month}`;
    return monthYear[2];
  }

  const yearOnly = raw.match(/^(\d{4})$/);
  if (yearOnly) return yearOnly[1];

  return undefined;
}

const DATE_RANGE_RE =
  /\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}(?:-\d{2})?)\s*[-–—]\s*((?:Present|Current|Now|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}(?:-\d{2})?))\s*$/i;

export type ParsedDateRange = {
  start?: string;
  end?: string;
  current?: boolean;
  remainder: string;
};

export function extractDateRange(line: string): ParsedDateRange {
  const match = line.match(DATE_RANGE_RE);
  if (!match) return { remainder: line.trim() };

  const start = normalizeDateToken(match[1]);
  const endToken = match[2];
  const endLower = endToken.toLowerCase();
  const current =
    endLower === "present" ||
    endLower === "current" ||
    endLower === "now";
  const end = current ? undefined : normalizeDateToken(endToken);

  const remainder = line.slice(0, match.index).trim().replace(/[|,]\s*$/, "");
  return { start, end, current, remainder };
}
