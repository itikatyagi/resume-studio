import { randomUUID } from "crypto";
import { resumeContentSchema, type ResumeContent } from "../schema";
import { normalizeDateToken } from "./date-utils";
import type { DraftResume } from "./types";

function validUrl(url?: string): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // ignore
  }
  return undefined;
}

function validDate(date?: string): string | undefined {
  if (!date) return undefined;
  const normalized = normalizeDateToken(date) ?? date;
  if (/^\d{4}(-\d{2})?$/.test(normalized)) return normalized;
  return undefined;
}

function defaultStartDate(): string {
  return "2000";
}

/** Map PDF draft into a schema-valid ResumeContent (server-side). */
export function normalizeDraftResume(draft: DraftResume): ResumeContent | null {
  const content: ResumeContent = {
    profile: {
      fullName: draft.profile.fullName || "Imported resume",
      email: draft.profile.email || "",
      headline: draft.profile.headline,
      phone: draft.profile.phone,
      location: draft.profile.location,
      links: [],
    },
    summary: draft.summary ?? "",
    experience: draft.experience.map((item, order) => ({
      id: randomUUID(),
      order,
      company: item.company || "Company",
      title: item.title || "Role",
      location: item.location,
      startDate: validDate(item.startDate) ?? defaultStartDate(),
      endDate: item.current ? undefined : validDate(item.endDate),
      current: item.current,
      bullets: item.bullets.length > 0 ? item.bullets : [""],
    })),
    education: draft.education.map((item, order) => ({
      id: randomUUID(),
      order,
      institution: item.institution || "Institution",
      degree: item.degree || "Degree",
      field: item.field,
      startDate: validDate(item.startDate),
      endDate: item.current ? undefined : validDate(item.endDate),
      current: item.current,
      details: item.details,
    })),
    skills:
      draft.skills.length > 0
        ? [
            {
              id: randomUUID(),
              order: 0,
              skills: draft.skills,
            },
          ]
        : [],
    projects: draft.projects.map((item, order) => ({
      id: randomUUID(),
      order,
      name: item.name || "Project",
      url: validUrl(item.url),
      startDate: validDate(item.startDate),
      endDate: item.current ? undefined : validDate(item.endDate),
      current: item.current,
      description: item.description,
      bullets: item.bullets,
    })),
    certifications: draft.certifications.map((item, order) => ({
      id: randomUUID(),
      order,
      name: item.name,
      issuer: item.issuer,
      date: validDate(item.date),
    })),
    languages: draft.languages.map((item, order) => ({
      id: randomUUID(),
      order,
      language: item.name,
      proficiency: item.level,
    })),
    customSections: [],
  };

  const parsed = resumeContentSchema.safeParse(content);
  if (!parsed.success) return null;
  return parsed.data;
}
