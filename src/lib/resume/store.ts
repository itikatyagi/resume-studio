"use client";

import { create } from "zustand";
import {
  createBlankResume,
  createSampleResume,
} from "./defaults";
import {
  applyTemplatePreset,
  applyThemeToDocument,
  getEffectiveLayout,
  resolveTypography,
} from "./layout-utils";
import { getDefaultLayoutForTemplate } from "./layout-presets";
import { getThemeLayout, isThemeId } from "./themes";
import { migrateResume } from "./migrations";
import type { LayoutConfig } from "./layout-schema";
import {
  resumeDocumentSchema,
  type CertificationItem,
  type CustomSection,
  type EducationItem,
  type ExperienceItem,
  type LanguageItem,
  type Profile,
  type ProjectItem,
  type ResumeContent,
  type ResumeDocument,
  type SkillEntry,
  type TemplateId,
} from "./schema";

const STORAGE_KEY = "resume-studio-document";
const SAVE_DELAY_MS = 600;

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(doc: ResumeDocument) {
  if (typeof window === "undefined") return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const toSave = {
        ...doc,
        meta: { ...doc.meta, updatedAt: new Date().toISOString() },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Quota exceeded or private mode — ignore
    }
  }, SAVE_DELAY_MS);
}

function loadFromStorage(): ResumeDocument | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = resumeDocumentSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return migrateResume(parsed.data);
  } catch {
    // Corrupt storage
  }
  return null;
}

function withContent(
  doc: ResumeDocument,
  content: ResumeContent,
): ResumeDocument {
  return { ...doc, content };
}

type ResumeStore = {
  document: ResumeDocument;
  hydrated: boolean;
  loadPersisted: () => void;
  setDocument: (document: ResumeDocument) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  updateSummary: (summary: string) => void;
  updateExperience: (experience: ExperienceItem[]) => void;
  updateEducation: (education: EducationItem[]) => void;
  updateSkills: (skills: SkillEntry[]) => void;
  updateProjects: (projects: ProjectItem[]) => void;
  updateCertifications: (certifications: CertificationItem[]) => void;
  updateLanguages: (languages: LanguageItem[]) => void;
  updateCustomSections: (customSections: CustomSection[]) => void;
  updateMetaTitle: (title: string) => void;
  setTemplateId: (templateId: TemplateId) => void;
  applyTheme: (themeId: string) => void;
  updateLayoutConfig: (patch: Partial<LayoutConfig>) => void;
  resetLayoutConfig: () => void;
  startWithTemplate: (templateId: TemplateId) => void;
  newBlank: () => void;
  loadSample: () => void;
  importDocument: (json: string) => boolean;
  importContent: (content: ResumeContent) => void;
  exportDocument: () => string;
};

function commit(set: (fn: (state: ResumeStore) => Partial<ResumeStore>) => void, doc: ResumeDocument) {
  set(() => ({ document: doc }));
  scheduleSave(doc);
}

export const useResumeStore = create<ResumeStore>()((set, get) => ({
  document: createBlankResume(),
  hydrated: false,

  loadPersisted: () => {
    const saved = loadFromStorage();
    set({
      document: saved ?? createBlankResume(),
      hydrated: true,
    });
  },

  setDocument: (document) => commit(set, document),

  updateProfile: (patch) => {
    const { document } = get();
    const doc = withContent(document, {
      ...document.content,
      profile: { ...document.content.profile, ...patch },
    });
    commit(set, doc);
  },

  updateSummary: (summary) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, summary }));
  },

  updateExperience: (experience) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, experience }));
  },

  updateEducation: (education) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, education }));
  },

  updateSkills: (skills) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, skills }));
  },

  updateProjects: (projects) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, projects }));
  },

  updateCertifications: (certifications) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, certifications }));
  },

  updateLanguages: (languages) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, languages }));
  },

  updateCustomSections: (customSections) => {
    const { document } = get();
    commit(set, withContent(document, { ...document.content, customSections }));
  },

  updateMetaTitle: (title) => {
    const { document } = get();
    const doc = {
      ...document,
      meta: { ...document.meta, title },
    };
    commit(set, doc);
  },

  setTemplateId: (templateId) => {
    const { document } = get();
    commit(set, applyTemplatePreset(document, templateId));
  },

  applyTheme: (themeId) => {
    if (!isThemeId(themeId)) return;
    const { document } = get();
    commit(set, applyThemeToDocument(document, themeId));
  },

  updateLayoutConfig: (patch) => {
    const { document } = get();
    const current = getEffectiveLayout(document);
    const next: LayoutConfig = {
      ...current,
      ...patch,
      colors: patch.colors
        ? { ...current.colors, ...patch.colors }
        : current.colors,
      typography: patch.typography
        ? { ...resolveTypography(current), ...patch.typography }
        : current.typography,
    };
    commit(set, { ...document, layoutConfig: next });
  },

  resetLayoutConfig: () => {
    const { document } = get();
    const layout = getEffectiveLayout(document);
    const themeId = layout.themeId ?? "novo-blue";
    commit(set, {
      ...document,
      layoutConfig: getThemeLayout(themeId),
    });
  },

  startWithTemplate: (templateId) => {
    const themeId = templateId;
    const doc = createBlankResume();
    commit(set, applyTemplatePreset(doc, themeId));
  },

  newBlank: () => {
    const doc = createBlankResume();
    commit(set, doc);
  },

  loadSample: () => {
    commit(set, createSampleResume());
  },

  importDocument: (json) => {
    try {
      const raw = JSON.parse(json) as unknown;
      const parsed = resumeDocumentSchema.safeParse(raw);
      if (!parsed.success) return false;
      commit(set, migrateResume(parsed.data));
      return true;
    } catch {
      return false;
    }
  },

  importContent: (content) => {
    const { document } = get();
    const title =
      content.profile.fullName.trim() || document.meta.title || "My resume";
    commit(set, {
      ...document,
      content,
      meta: {
        ...document.meta,
        title,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  exportDocument: () => JSON.stringify(get().document, null, 2),
}));

export function nextOrder(items: { order: number }[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.order)) + 1;
}

export function createId(): string {
  return crypto.randomUUID();
}
