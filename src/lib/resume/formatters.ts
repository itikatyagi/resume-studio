import type { ResumeContent } from "./schema";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(date?: string): string {
  if (!date) return "";
  const match = date.match(/^(\d{4})(?:-(\d{2}))?$/);
  if (!match) return date;
  const [, year, month] = match;
  if (!month) return year;
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return date;
  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatDateRange(
  start?: string,
  end?: string,
  current?: boolean,
): string {
  const startFormatted = formatDate(start);
  if (!startFormatted) return "";
  if (current) return `${startFormatted} – Present`;
  const endFormatted = formatDate(end);
  if (!endFormatted) return startFormatted;
  return `${startFormatted} – ${endFormatted}`;
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function hasText(value?: string): boolean {
  return Boolean(value?.trim());
}

export function hasProfileContent(profile: ResumeContent["profile"]): boolean {
  return (
    hasText(profile.fullName) ||
    hasText(profile.email) ||
    hasText(profile.headline) ||
    hasText(profile.phone) ||
    hasText(profile.location) ||
    profile.links.length > 0
  );
}

export function hasSummaryContent(summary?: string): boolean {
  return hasText(summary);
}

export function hasExperienceContent(
  items: ResumeContent["experience"],
): boolean {
  return items.some(
    (item) =>
      hasText(item.company) ||
      hasText(item.title) ||
      item.bullets.some((b) => hasText(b)),
  );
}

export function hasEducationContent(items: ResumeContent["education"]): boolean {
  return items.some(
    (item) =>
      hasText(item.institution) ||
      hasText(item.degree) ||
      hasText(item.details),
  );
}

export function hasSkillsContent(items: ResumeContent["skills"]): boolean {
  return items.some((item) => item.skills.some((s) => hasText(s)));
}

export function hasProjectsContent(items: ResumeContent["projects"]): boolean {
  return items.some(
    (item) =>
      hasText(item.name) ||
      hasText(item.description) ||
      item.bullets.some((b) => hasText(b)),
  );
}

export function hasCertificationsContent(
  items: ResumeContent["certifications"],
): boolean {
  return items.some((item) => hasText(item.name) || hasText(item.issuer));
}

export function hasLanguagesContent(items: ResumeContent["languages"]): boolean {
  return items.some((item) => hasText(item.language));
}

export function hasCustomSectionsContent(
  items: ResumeContent["customSections"],
): boolean {
  return items.some(
    (item) => hasText(item.title) || hasText(item.content),
  );
}

export function hasResumeContent(content: ResumeContent): boolean {
  return (
    hasProfileContent(content.profile) ||
    hasSummaryContent(content.summary) ||
    hasExperienceContent(content.experience) ||
    hasEducationContent(content.education) ||
    hasSkillsContent(content.skills) ||
    hasProjectsContent(content.projects) ||
    hasCertificationsContent(content.certifications) ||
    hasLanguagesContent(content.languages) ||
    hasCustomSectionsContent(content.customSections)
  );
}

export function joinContactParts(parts: (string | undefined)[]): string {
  return parts.filter((p) => hasText(p)).join(" · ");
}
