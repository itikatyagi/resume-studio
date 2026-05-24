import type {
  FontFamily,
  LayoutConfig,
  LayoutSectionId,
  Typography,
} from "./layout-schema";
import {
  DEFAULT_STYLE_OPTIONS,
  DEFAULT_TYPOGRAPHY,
  LAYOUT_SECTION_IDS,
  layoutConfigSchema,
} from "./layout-schema";

export const SECTION_LABELS: Record<LayoutSectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  customSections: "Custom sections",
};
import { getDefaultLayoutForTemplate } from "./layout-presets";
import { getThemeLayout, resolveThemeId } from "./themes";
import type { ResumeDocument, TemplateId } from "./schema";

export const FONT_STACKS: Record<FontFamily, string> = {
  inter: 'var(--font-sans), Inter, system-ui, sans-serif',
  roboto: 'var(--font-roboto), Roboto, "Segoe UI", system-ui, sans-serif',
  georgia: 'Georgia, "Times New Roman", Times, serif',
  lato: '"Lato", var(--font-inter), system-ui, sans-serif',
  merriweather: 'var(--font-merriweather), Merriweather, Georgia, serif',
  "open-sans": '"Open Sans", var(--font-inter), system-ui, sans-serif',
};

export function resolveTypography(layout: LayoutConfig): Typography {
  return { ...DEFAULT_TYPOGRAPHY, ...layout.typography };
}

export function resolveStyleOptions(layout: LayoutConfig) {
  return {
    profileStyle: layout.profileStyle ?? DEFAULT_STYLE_OPTIONS.profileStyle,
    headingStyle: layout.headingStyle ?? DEFAULT_STYLE_OPTIONS.headingStyle,
    skillStyle: layout.skillStyle ?? DEFAULT_STYLE_OPTIONS.skillStyle,
    pagePaddingIn: layout.pagePaddingIn ?? DEFAULT_STYLE_OPTIONS.pagePaddingIn,
  };
}

export function getEffectiveLayout(document: ResumeDocument): LayoutConfig {
  const templatePreset = getDefaultLayoutForTemplate(document.templateId);
  const base = document.layoutConfig?.themeId
    ? getThemeLayout(document.layoutConfig.themeId)
    : templatePreset;
  const overrides: Partial<LayoutConfig> = document.layoutConfig ?? {};

  const merged: LayoutConfig = {
    ...base,
    ...overrides,
    colors: { ...base.colors, ...overrides.colors },
    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...base.typography,
      ...overrides.typography,
    },
    profileStyle:
      overrides.profileStyle ??
      base.profileStyle ??
      DEFAULT_STYLE_OPTIONS.profileStyle,
    headingStyle:
      overrides.headingStyle ??
      base.headingStyle ??
      DEFAULT_STYLE_OPTIONS.headingStyle,
    skillStyle:
      overrides.skillStyle ?? base.skillStyle ?? DEFAULT_STYLE_OPTIONS.skillStyle,
    pagePaddingIn:
      overrides.pagePaddingIn ??
      base.pagePaddingIn ??
      DEFAULT_STYLE_OPTIONS.pagePaddingIn,
    sidebarSections: overrides.sidebarSections ?? base.sidebarSections,
    mainSections: overrides.mainSections ?? base.mainSections,
  };

  return layoutConfigSchema.parse(merged);
}

export function layoutToCssVariables(
  layout: LayoutConfig,
): Record<string, string> {
  const typo = resolveTypography(layout);
  return {
    "--resume-accent": layout.colors.accent,
    "--resume-header-bg": layout.colors.headerBg,
    "--resume-header-text": layout.colors.headerText,
    "--resume-sidebar-bg": layout.colors.sidebarBg,
    "--resume-sidebar-text": layout.colors.sidebarText,
    "--resume-main-text": layout.colors.mainText,
    "--resume-main-muted": layout.colors.mainMuted,
    "--resume-font-family": FONT_STACKS[typo.fontFamily],
    "--resume-font-size": `${typo.baseSizePt}pt`,
    "--resume-line-height": String(typo.lineHeight),
  };
}

export function applyThemeToDocument(
  document: ResumeDocument,
  themeId: string,
): ResumeDocument {
  return {
    ...document,
    templateId: "universal-v1",
    layoutConfig: getThemeLayout(themeId),
  };
}

export function applyTemplatePreset(
  document: ResumeDocument,
  templateOrThemeId: TemplateId | string,
): ResumeDocument {
  const themeId = resolveThemeId(templateOrThemeId);
  if (themeId) return applyThemeToDocument(document, themeId);
  return {
    ...document,
    templateId: document.templateId,
    layoutConfig: getDefaultLayoutForTemplate(templateOrThemeId),
  };
}

export function moveSectionInList<T>(
  list: T[],
  index: number,
  dir: -1 | 1,
): T[] {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function getSectionColumn(
  layout: LayoutConfig,
  sectionId: LayoutSectionId,
): "sidebar" | "main" | "hidden" {
  if (layout.sidebarSections.includes(sectionId)) return "sidebar";
  if (layout.mainSections.includes(sectionId)) return "main";
  return "hidden";
}

export function setSectionColumn(
  layout: LayoutConfig,
  sectionId: LayoutSectionId,
  column: "sidebar" | "main" | "hidden",
): LayoutConfig {
  const sidebar = layout.sidebarSections.filter((s) => s !== sectionId);
  const main = layout.mainSections.filter((s) => s !== sectionId);
  if (column === "sidebar") sidebar.push(sectionId);
  if (column === "main") main.push(sectionId);
  return { ...layout, sidebarSections: sidebar, mainSections: main };
}

export function getHiddenLayoutSections(
  layout: LayoutConfig,
): LayoutSectionId[] {
  return LAYOUT_SECTION_IDS.filter(
    (id) =>
      !layout.sidebarSections.includes(id) &&
      !layout.mainSections.includes(id),
  );
}

/** Content editor order: sidebar (top→bottom), then main, then hidden. */
export function getContentEditorSectionOrder(
  layout: LayoutConfig,
): LayoutSectionId[] {
  const hidden = getHiddenLayoutSections(layout);
  if (layout.structure === "single-column") {
    return [...layout.mainSections, ...hidden];
  }
  return [...layout.sidebarSections, ...layout.mainSections, ...hidden];
}

export function moveLayoutSection(
  layout: LayoutConfig,
  sectionId: LayoutSectionId,
  dir: -1 | 1,
): Partial<LayoutConfig> | null {
  const column = getSectionColumn(layout, sectionId);
  if (column === "hidden") return null;
  const key =
    column === "sidebar" ? "sidebarSections" : "mainSections";
  const list = layout[key];
  const index = list.indexOf(sectionId);
  if (index < 0) return null;
  return { [key]: moveSectionInList(list, index, dir) };
}
